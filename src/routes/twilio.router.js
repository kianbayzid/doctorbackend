import express from 'express';
import sequelize from '../libs/sequelize.js';

const { models } = sequelize;
const router = express.Router();

// Twilio sends form data
router.use(express.urlencoded({ extended: false }));

// Step 1: Incoming call → build dynamic menu
router.post('/call', async (req, res) => {
  // Fetch all doctors
  const doctors = await models.Doctor.findAll();

  // Build IVR menu text dynamically
  let menuText = 'Welcome. ';
  doctors.forEach((doc, index) => {
    menuText += `Press ${index + 1} for ${doc.name}. `;
  });

  // Generate TwiML
  const twiml = `
    <Response>
      <Gather numDigits="1" action="/api/v1/twilio/menu" method="POST">
        <Say>${menuText}</Say>
      </Gather>
    </Response>
  `;

  res.type('text/xml');
  res.send(twiml);
});

// Step 2: Handle menu selection
router.post('/menu', async (req, res) => {
  const digit = parseInt(req.body.Digits, 10);

  // Fetch doctors again (same order)
  const doctors = await models.Doctor.findAll();
  const doctor = doctors[digit - 1]; // digit is 1-based

  let twiml;
  if (!doctor) {
    twiml = `
      <Response>
        <Say>Invalid option. Goodbye.</Say>
        <Hangup/>
      </Response>
    `;
  } else if (doctor.available) {
    twiml = `
      <Response>
        <Say>Connecting you to doctor ${doctor.name}.</Say>
        <Dial>${doctor.phone}</Dial>
      </Response>
    `;
  } else {
    twiml = `
      <Response>
        <Say>Doctor ${doctor.name} is not available. Please leave a message after the beep.</Say>
        <Record action="/api/v1/twilio/voicemail" />
      </Response>
    `;
  }

  res.type('text/xml');
  res.send(twiml);
});

// Step 3: Save voicemail
router.post('/voicemail', async (req, res) => {
  const recordingUrl = req.body.RecordingUrl;
  const from = req.body.From;
  const to = req.body.To;

  console.log('📞 New voicemail from', from, 'to', to, 'recording:', recordingUrl);

  // TODO: Save to messages table once ready
  const twiml = `
    <Response>
      <Say>Thank you for your message. Goodbye.</Say>
    </Response>
  `;
  res.type('text/xml');
  res.send(twiml);
});

export default router;