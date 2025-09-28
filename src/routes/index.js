import express from 'express';
import doctorsRouter from './doctors.router.js';
import patientsRouter from './patients.router.js';
import messagesRouter from './message.router.js';
import twilioRouter from './twilio.router.js';
import authRouter from './auth.router.js';

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // router.use('/doctors', checkJwt, doctorsRouter);
  // router.use('/patients', checkJwt, patientsRouter);
  router.use('/doctors', doctorsRouter);
  router.use('/patients', patientsRouter);
  router.use('/messages', messagesRouter);
  router.use('/twilio', twilioRouter);
  router.use('/auth', authRouter);
}

export default routerApi;