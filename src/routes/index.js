import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import doctorsRouter from './doctors.router.js';
import patientsRouter from './patients.router.js';

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/doctors', checkJwt, doctorsRouter);
  router.use('/patients', patientsRouter);
}

export default routerApi;

