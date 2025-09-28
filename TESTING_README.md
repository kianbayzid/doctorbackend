# Testing Guide for Message Access API

This guide will help you test the new message access endpoints that allow patients and doctors to view their respective messages.

## Quick Start

### 1. Start the Server

```bash
# Install dependencies (if not already done)
npm install

# Start the server
npm start
# or for development with auto-reload
npm run dev
```

The server will run on `http://localhost:3000` by default.

### 2. Set Up Test Data

Run the SQL script to insert sample data:

```bash
# If using psql
psql -d your_database_name -f setup_test_data.sql

# Or run the SQL commands directly in your database client
```

### 3. Run Tests

Choose one of the following methods:

#### Option A: Manual Curl Commands
Use the commands from `curl_test_cases.md`

#### Option B: Automated Scripts
```bash
# For Linux/Mac
chmod +x test_endpoints.sh
./test_endpoints.sh

# For Windows PowerShell
.\test_endpoints.ps1
```

## Test Scenarios

### ✅ What Should Work

1. **Health Check**: `GET /` should return "Doctor voicemail API is running 🚀"
2. **Unauthenticated Requests**: Should return 401 Unauthorized
3. **Authenticated Patient Messages**: `GET /api/v1/patients/1/messages` with valid JWT
4. **Authenticated Doctor Messages**: `GET /api/v1/doctors/1/messages` with valid JWT
5. **All Messages**: `GET /api/v1/messages` (no auth required)

### ❌ What Should Fail

1. **Missing JWT Token**: Should return 401
2. **Invalid JWT Token**: Should return 401
3. **Invalid Patient/Doctor ID**: Should handle gracefully

## Sample Test Data

After running `setup_test_data.sql`, you'll have:

- **3 Doctors**: Dr. Smith (ID: 1), Dr. Johnson (ID: 2), Dr. Williams (ID: 3)
- **3 Patients**: John Doe (ID: 1), Jane Smith (ID: 2), Bob Johnson (ID: 3)
- **9 Messages**: Various types (voicemail, text, email) with different priorities and statuses

## Expected Responses

### Patient Messages Response
```json
[
  {
    "idMessage": 1,
    "idDoctor": 1,
    "idPatient": 1,
    "audioUrl": "https://example.com/audio1.mp3",
    "recordingSid": "RE123456789",
    "messageContent": "I have been experiencing chest pain for the past week",
    "tldr": "Patient reports chest pain for one week",
    "messageType": "voicemail",
    "priority": "high",
    "status": "unread",
    "isProcessed": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "doctor": {
      "idDoctor": 1,
      "name": "Dr. Smith",
      "phone": "+1234567890"
    },
    "patient": {
      "idPatient": 1,
      "name": "John Doe",
      "phone": "+0987654321"
    }
  }
]
```

## Troubleshooting

### Common Issues

1. **"Connection refused"**
   - Server is not running
   - Check if port 3000 is available
   - Run `npm start` or `npm run dev`

2. **"Unauthorized" errors**
   - JWT token is missing or invalid
   - Check your Auth0 configuration
   - Ensure the token is properly formatted

3. **Empty arrays `[]`**
   - No messages found for the specified ID
   - Check if test data was inserted correctly
   - Verify the patient/doctor ID exists

4. **Database errors**
   - Check your database connection
   - Run migrations: `npm run migrate`
   - Verify environment variables

### Debug Mode

To see detailed logs, check the server console output. The authorization middleware logs access attempts:

```
Patient access check: requested ID 1, auth user auth0|123456789
Doctor access check: requested ID 1, auth user auth0|123456789
```

## JWT Token Setup

To test authenticated endpoints, you need a valid JWT token from Auth0:

1. **Get a token from Auth0 Dashboard**
2. **Or use Auth0's test token endpoint**
3. **Or create a test user and get their token**

Example token format:
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1yNS1BVWlZUWJZR0doR1AifQ...
```

## API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Health check |
| GET | `/api/v1/messages` | No | All messages |
| GET | `/api/v1/patients/:id/messages` | Yes | Patient's messages |
| GET | `/api/v1/doctors/:id/messages` | Yes | Doctor's messages |
| GET | `/api/v1/patients` | Yes | All patients |
| GET | `/api/v1/doctors` | Yes | All doctors |

## Next Steps

1. **Test all endpoints** using the provided scripts
2. **Verify authorization** works correctly
3. **Test with different user roles** (patient vs doctor)
4. **Integrate with your frontend** using the API documentation
5. **Set up proper user-to-patient/doctor mapping** in production

## Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify your database connection and data
3. Ensure your JWT token is valid and properly formatted
4. Check that all environment variables are set correctly
