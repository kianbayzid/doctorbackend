
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import axios from 'axios';

describe('Doctors API', () => {
  let authToken;
  let newDoctorId;

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
  });

  it('should create a new doctor', async () => {
    // 2. Post new placeholder doctor
    const doctorData = {
      name: 'Dr. Jane Smith',
      phone: `555-555-${Math.floor(Math.random() * 10000)}` // random phone to avoid unique constraint errors
    };

    const createResponse = await axios.post('http://localhost:3000/api/v1/doctors', doctorData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.data.name).toBe(doctorData.name);
    expect(createResponse.data.id).toBeDefined();
    newDoctorId = createResponse.data.id;
  });

  it('should retrieve the newly created doctor', async () => {
    // 3. Retrieve newly created placeholder doctor
    expect(newDoctorId).toBeDefined(); // Ensure the previous test ran and set the ID

    const getResponse = await axios.get(`http://localhost:3000/api/v1/doctors/${newDoctorId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(getResponse.status).toBe(200);
    expect(getResponse.data.id).toBe(newDoctorId);
    expect(getResponse.data.name).toBe('Dr. Jane Smith');
  });
});

describe('Patients API', () => {
  let newPatientId;

  it('should create a new patient', async () => {
    const patientData = {
      name: 'John Patient',
      phone: `555-867-${Math.floor(Math.random() * 10000)}` // random phone to avoid unique constraint errors
    };

    const createResponse = await axios.post('http://localhost:3000/api/v1/patients', patientData);

    expect(createResponse.status).toBe(201);
    expect(createResponse.data.name).toBe(patientData.name);
    expect(createResponse.data.id).toBeDefined();
    newPatientId = createResponse.data.id;
  });

  it('should retrieve the newly created patient', async () => {
    expect(newPatientId).toBeDefined(); // Ensure the previous test ran and set the ID

    const getResponse = await axios.get(`http://localhost:3000/api/v1/patients/${newPatientId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.data.id).toBe(newPatientId);
    expect(getResponse.data.name).toBe('John Patient');
  });
});
