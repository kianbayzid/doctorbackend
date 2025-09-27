import express from 'express';
import sequelize from '../libs/sequelize.js';
import MessageService from '../services/message.service.js';

const { models } = sequelize;
const router = express.Router();
const messageService = new MessageService();

// Twilio sends x-www-form-urlencoded
router.use(express.urlencoded({ extended: true }));

// Helper to build absolute public URL (use NGROK from .env)
function baseUrl(req) {
  return process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
}

// 1) Incoming call → IVR menu
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

// 2) Handle doctor selection
router.post('/menu', async (req, res) => {
  const digit = parseInt(req.body.Digits, 10);
  const doctors = await models.Doctor.findAll();
  const doctor = doctors[digit - 1];

  let twiml;
  if (!doctor) {
    twiml = `<Response><Say>Invalid option. Goodbye.</Say><Hangup/></Response>`;
  } else if (doctgitor.available) {
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

// 3) Handle voicemail recording
router.post('/voicemail', async (req, res) => {
  console.log('📩 Twilio webhook hit! Body:', req.body);

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
      recordingSid: RecordingSid,   // store sid for linking transcription
      messageContent: null,         // will be updated by /transcription
      messageType: 'voicemail',
      priority: 'medium',
      status: 'unread',
    });

    console.log(`✅ Voicemail saved for doctor=${doctorId}, patient=${patient.idPatient}, sid=${RecordingSid}`);

    res.type('text/xml').send('<Response><Say>Thank you for your message. Goodbye.</Say></Response>');
  } catch (error) {
    console.error('❌ Error saving voicemail:', error);
    res.type('text/xml').send('<Response><Say>Sorry, something went wrong.</Say></Response>');
  }
});

// 4) Transcription arrives asynchronously
router.post('/transcription', async (req, res) => {
  console.log('📝 /transcription body:', req.body);
  const { RecordingSid, TranscriptionText } = req.body;

  try {
    const [count] = await models.Message.update(
      {
        messageContent: TranscriptionText || null,
        isProcessed: true,
      },
      {
        where: { recordingSid: RecordingSid }
      }
    );

    console.log(`🛠️ Transcription updated ${count} message(s) for sid=${RecordingSid}`);
    res.type('text/xml').send('<Response/>');
  } catch (err) {
    console.error('❌ Error updating transcription:', err);
    res.type('text/xml').send('<Response/>');
  }
});

// 5) Optional: recording status events
router.post('/recording-status', async (req, res) => {
  console.log('🎧 /recording-status:', req.body);
  res.type('text/xml').send('<Response/>');
});

export default router;