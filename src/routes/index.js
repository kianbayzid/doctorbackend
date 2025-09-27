import express from 'express';
import doctorsRouter from './doctors.router.js';

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/doctors', doctorsRouter);
}

export default routerApi;