import express from 'express';
import sequelize from '../libs/sequelize.js';
import MessageService from '../services/message.service.js';
import { InferenceClient } from '@huggingface/inference';

const { models } = sequelize;
const router = express.Router();
const messageService = new MessageService();
const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

router.use(express.urlencoded({ extended: true }));

function baseUrl(req) {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
}

function normalizeTranscript(txt) {
  if (!txt) return '';
  let t = txt.replace(/\s+/g, ' ').trim();
  t = t.replace(/\b(hi|hello|hey)\b[,!.\s]*/i, '');
  t = t.replace(/\b(this is|it's|i am|i'm)\b\s+[a-z]+[a-z-]*[,!.\s]*/i, '');
  t = t.replace(/\b(how are you|thank you|thanks|bye)\b[,!.\s]*/gi, '');
  return t.trim();
}

function cleanPhrase(p) {
  if (!p) return '';
  return p.replace(/\s*##/g, '').replace(/\s{2,}/g, ' ').trim();
}

function compressToShortReason(phrases) {
  const keep = [];
  for (const p of phrases) {
    const s = p.toLowerCase();
    if (!keep.includes(s)) keep.push(s);
    if (keep.length >= 2) break;
  }
  return keep
    .map(s =>
      s
        .replace(/\brefill(s)?\b.*\b(meds?|medication|prescription)\b/, 'refill medication')
        .replace(/\b(referral|refer)\b.*\b(meds?|medication|specialist)\b/, 'referral')
        .replace(/\b(back|lower back)\s+pain\b/, 'back pain')
        .replace(/\bheadaches?\b/, 'headache')
        .replace(/\bfatigue(d)?\b/, 'fatigue')
        .replace(/\b(appointment|follow[-\s]?up)\b/, 'follow-up')
        .replace(/\b(results?)\b/, 'test results')
        .replace(/\bpain\b/, 'pain')
        .trim()
    )
    .join(', ');
}

async function extractClinicalReason(text) {
  const input = normalizeTranscript(text);
  if (!input) return '';

  try {
    const ner = await hf.tokenClassification({
      model: 'd4data/biomedical-ner-all',
      inputs: input,
      parameters: { aggregation_strategy: 'simple' },
    });

    const allowedHints = [
      'SYMPTOM', 'SIGN', 'PROBLEM', 'DISEASE', 'DISORDER', 'CONDITION',
      'INJURY', 'PAIN'
    ];
    const phrases = ner
      .filter(e => {
        const g = (e.entity_group || '').toUpperCase();
        return allowedHints.some(h => g.includes(h));
      })
      .map(e => cleanPhrase(e.word))
      .filter(Boolean);

    if (phrases.length) {
      return compressToShortReason(phrases);
    }
  } catch (e) {
    console.error('Clinical NER failed:', e);
  }

  try {
    const kp = await hf.tokenClassification({
      model: 'ml6team/keyphrase-extraction-distilbert-kptimes',
      inputs: input,
      parameters: { aggregation_strategy: 'simple' },
    });
    const phrases = kp
      .map(e => cleanPhrase(e.word))
      .filter(Boolean)
      .filter((p, i, arr) => arr.indexOf(p) === i && p.length > 2);

    if (phrases.length) {
      return compressToShortReason(phrases);
    }
  } catch (e) {
    console.error('Keyphrase extraction failed:', e);
  }

  const rules = [
    [/refill|medication|prescription/i, 'refill medication'],
    [/referr(al|ed)|specialist/i, 'referral'],
    [/\b(back|lower back)\b.*\bpain\b/i, 'back pain'],
    [/\bheadaches?\b/i, 'headache'],
    [/\bfatigue(d)?\b/i, 'fatigue'],
    [/follow[-\s]?up|appointment/i, 'follow-up'],
    [/results?/i, 'test results'],
    [/pain/i, 'pain'],
  ];
  for (const [re, label] of rules) {
    if (re.test(input)) return label;
  }
  return '';
}

router.post('/call', async (req, res) => {
  const doctors = await models.Doctor.findAll();
  const options = doctors.map((d, idx) => `Press ${idx + 1} for Doctor ${d.name}.`).join(' ');

  const twiml = `
    <Response>
      <Gather numDigits="1" action="${baseUrl(req)}/api/v1/twilio/menu" method="POST">
        <Say>Welcome. ${options}</Say>
      </Gather>
      <Say>We didn't receive any input. Goodbye.</Say>
      <Hangup/>
    </Response>
  `;
  res.type('text/xml').send(twiml);
});

router.post('/menu', async (req, res) => {
  const digit = parseInt(req.body.Digits, 10);
  const doctors = await models.Doctor.findAll();
  const doctor = doctors[digit - 1];

  let twiml;
  if (!doctor) {
    twiml = `<Response><Say>Invalid option. Goodbye.</Say><Hangup/></Response>`;
  } else if (doctor.available) {
    twiml = `
      <Response>
        <Say>Connecting you to Doctor ${doctor.name}.</Say>
        <Dial>${doctor.phone}</Dial>
      </Response>
    `;
  } else {
    const url = baseUrl(req);
    twiml = `
      <Response>
        <Say>Doctor ${doctor.name} is not available. Please leave a message after the beep.</Say>
        <Record
          method="POST"
          action="${url}/api/v1/twilio/voicemail?doctorId=${doctor.idDoctor}"
          transcribe="true"
          transcribeCallback="${url}/api/v1/twilio/transcription"
          recordingStatusCallback="${url}/api/v1/twilio/recording-status"
        />
        <Say>No recording received. Goodbye.</Say>
        <Hangup/>
      </Response>
    `;
  }

  res.type('text/xml').send(twiml);
});

router.post('/voicemail', async (req, res) => {
  const { RecordingUrl, RecordingSid, From } = req.body;
  const { doctorId } = req.query;

  try {
    let fromPhone = (From || '').trim();
    if (!fromPhone) fromPhone = 'unknown-' + Date.now();

    let patient = await models.Patient.findOne({ where: { phone: fromPhone } });
    if (!patient) {
      patient = await models.Patient.create({ name: 'Unknown', phone: fromPhone });
    }

    await messageService.create({
      idDoctor: Number(doctorId),
      idPatient: patient.idPatient,
      audioUrl: RecordingUrl,
      recordingSid: RecordingSid,
      messageContent: null,
      messageType: 'voicemail',
      priority: 'medium',
      status: 'unread',
    });

    res.type('text/xml').send('<Response><Say>Thank you for your message. Goodbye.</Say></Response>');
  } catch (error) {
    res.type('text/xml').send('<Response><Say>Sorry, something went wrong.</Say></Response>');
  }
});

router.post('/transcription', async (req, res) => {
  const { RecordingSid, TranscriptionText } = req.body;

  try {
    await models.Message.update(
      { messageContent: TranscriptionText || null, isProcessed: true },
      { where: { recordingSid: RecordingSid } }
    );

    if (TranscriptionText && TranscriptionText.trim().length > 0) {
      const reason = await extractClinicalReason(TranscriptionText);
      if (reason) {
        await models.Message.update(
          { tldr: reason },
          { where: { recordingSid: RecordingSid } }
        );
      }
    }

    res.type('text/xml').send('<Response/>');
  } catch (err) {
    res.type('text/xml').send('<Response/>');
  }
});

router.post('/recording-status', async (req, res) => {
  res.type('text/xml').send('<Response/>');
});

export default router;