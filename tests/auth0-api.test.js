import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import request from 'supertest';
import app from '../src/app.js';
import axios from 'axios';

let authToken;

beforeAll(async () => {
  // 1. Get Bearer key from Auth0
  const authResponse = await axios.post('https://dev-hn2kpluyia73s240.us.auth0.com/oauth/token', {
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
    grant_type: 'client_credentials'
  }, {
    headers: {
      'content-type': 'application/json'
    }
  });
  authToken = authResponse.data.access_token;
}, 30000);

describe('Doctors API', () => {
  let newDoctorId;

  it('should create a new doctor', async () => {
    // 2. Post new placeholder doctor
    const doctorData = {
      name: 'Dr. Jane Smith',
      phone: `555-555-${Math.floor(Math.random() * 10000)}`, // random phone to avoid unique constraint errors
      idAuth0: `auth0|${Math.random().toString(36).substring(2, 15)}`
    };

    const createResponse = await request(app)
      .post('/api/v1/doctors')
      .send(doctorData)
      .set('Authorization', `Bearer ${authToken}`);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.name).toBe(doctorData.name);
    expect(createResponse.body.idDoctor).toBeDefined();
    newDoctorId = createResponse.body.idDoctor;
  });

  it('should retrieve the newly created doctor', async () => {
    // 3. Retrieve newly created placeholder doctor
    expect(newDoctorId).toBeDefined(); // Ensure the previous test ran and set the ID

    const getResponse = await request(app)
      .get(`/api/v1/doctors/${newDoctorId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.idDoctor).toBe(newDoctorId);
    expect(getResponse.body.name).toBe('Dr. Jane Smith');
  });
});

describe('Patients API', () => {
  let newPatientId;

  it('should create a new patient', async () => {
    const patientData = {
      name: 'John Patient',
      phone: `555-867-${Math.floor(Math.random() * 10000)}` // random phone to avoid unique constraint errors
    };

    const createResponse = await request(app)
      .post('/api/v1/patients')
      .send(patientData)
      .set('Authorization', `Bearer ${authToken}`);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.name).toBe(patientData.name);
    expect(createResponse.body.idPatient).toBeDefined();
    newPatientId = createResponse.body.idPatient;
  });

  it('should retrieve the newly created patient', async () => {
    expect(newPatientId).toBeDefined(); // Ensure the previous test ran and set the ID

    const getResponse = await request(app)
      .get(`/api/v1/patients/${newPatientId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.idPatient).toBe(newPatientId);
    expect(getResponse.body.name).toBe('John Patient');
  });
});
