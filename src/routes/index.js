import express from 'express';
import doctorsRouter from './doctors.router.js';
import patientsRouter from './patients.router.js';
import messagesRouter from './message.router.js';

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/doctors', doctorsRouter);
  router.use('/patients', patientsRouter);
  router.use('/messages', messagesRouter);
}

export default routerApi;