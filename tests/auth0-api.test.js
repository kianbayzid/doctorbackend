
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

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
});

describe('Doctors API', () => {
  let newDoctorId;

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
    expect(createResponse.data.idDoctor).toBeDefined();
    newDoctorId = createResponse.data.idDoctor;
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
    expect(getResponse.data.idDoctor).toBe(newDoctorId);
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

    const createResponse = await axios.post('http://localhost:3000/api/v1/patients', patientData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.data.name).toBe(patientData.name);
    expect(createResponse.data.idPatient).toBeDefined();
    newPatientId = createResponse.data.idPatient;
  });

  it('should retrieve the newly created patient', async () => {
    expect(newPatientId).toBeDefined(); // Ensure the previous test ran and set the ID

    const getResponse = await axios.get(`http://localhost:3000/api/v1/patients/${newPatientId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(getResponse.status).toBe(200);
    expect(getResponse.data.idPatient).toBe(newPatientId);
    expect(getResponse.data.name).toBe('John Patient');
  });
});
