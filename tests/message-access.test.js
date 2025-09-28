import request from 'supertest';
import app from '../src/app.js';

describe('Message Access Endpoints', () => {
  describe('GET /api/v1/patients/:id/messages', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/patients/1/messages')
        .expect(401);
      
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return messages for a specific patient when authenticated', async () => {
      // This test would require a valid JWT token
      // In a real test environment, you'd mock the JWT verification
      const mockToken = 'mock-jwt-token';
      
      const response = await request(app)
        .get('/api/v1/patients/1/messages')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
      
      // The response should be an array of messages
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/v1/doctors/:id/messages', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/doctors/1/messages')
        .expect(401);
      
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should return messages for a specific doctor when authenticated', async () => {
      // This test would require a valid JWT token
      const mockToken = 'mock-jwt-token';
      
      const response = await request(app)
        .get('/api/v1/doctors/1/messages')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);
      
      // The response should be an array of messages
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
