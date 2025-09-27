import express from 'express';
import doctorsRouter from './doctors.router.js';
import patientsRouter from './patients.router.js';
import twilioRouter from './twilio.router.js';

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/doctors', doctorsRouter);
  router.use('/patients', patientsRouter);
  router.use('/twilio', twilioRouter);
}

export default routerApi;