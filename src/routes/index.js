import express from 'express';
import doctorsRouter from './doctors.router.js';
import patientsRouter from './patients.router.js';

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/doctors', doctorsRouter);
  router.use('/patients', patientsRouter);
}

export default routerApi;