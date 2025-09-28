import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import doctorsRouter from './doctors.router.js';
import patientsRouter from './patients.router.js';
import messagesRouter from './message.router.js';
import twilioRouter from './twilio.router.js';


function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/doctors', doctorsRouter);
  router.use('/patients', patientsRouter);
  router.use('/messages', messagesRouter);
  router.use('/twilio', twilioRouter);
}

export default routerApi;
