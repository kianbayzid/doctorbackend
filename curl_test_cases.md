# Curl Test Cases for Message Access API

This document contains comprehensive curl test cases to test all the message access endpoints.

## Prerequisites

1. **Start the server:**
   ```bash
   npm start
   # or
   npm run dev
   ```

2. **Server runs on:** `http://localhost:3000` (default)

3. **JWT Token:** You'll need a valid JWT token from Auth0 for authenticated requests

## Test Cases

### 1. Health Check

```bash
# Test if server is running
curl -X GET http://localhost:3000/ \
  -H "Content-Type: application/json"
```

**Expected Response:**
```
Doctor voicemail API is running 🚀
```

### 2. Patient Messages Endpoint

#### 2.1 Get Patient Messages (Unauthenticated - Should Fail)

```bash
# Test without authentication
curl -X GET http://localhost:3000/api/v1/patients/1/messages \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:**
```json
{
  "error": "Unauthorized",
  "message": "No user ID found in token"
}
```

#### 2.2 Get Patient Messages (Authenticated - Success)

```bash
# Test with valid JWT token
curl -X GET http://localhost:3000/api/v1/patients/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -v
```

**Expected Response:**
```json
[
  {
    "idMessage": 1,
    "idDoctor": 1,
    "idPatient": 1,
    "audioUrl": "https://example.com/audio.mp3",
    "recordingSid": "RE123456789",
    "messageContent": "Patient message content",
    "tldr": "Summary of the message",
    "messageType": "voicemail",
    "priority": "medium",
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

#### 2.3 Get Patient Messages (Different Patient ID)

```bash
# Test with different patient ID
curl -X GET http://localhost:3000/api/v1/patients/2/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -v
```

### 3. Doctor Messages Endpoint

#### 3.1 Get Doctor Messages (Unauthenticated - Should Fail)

```bash
# Test without authentication
curl -X GET http://localhost:3000/api/v1/doctors/1/messages \
  -H "Content-Type: application/json" \
  -v
```

**Expected Response:**
```json
{
  "error": "Unauthorized",
  "message": "No user ID found in token"
}
```

#### 3.2 Get Doctor Messages (Authenticated - Success)

```bash
# Test with valid JWT token
curl -X GET http://localhost:3000/api/v1/doctors/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -v
```

**Expected Response:**
```json
[
  {
    "idMessage": 1,
    "idDoctor": 1,
    "idPatient": 1,
    "audioUrl": "https://example.com/audio.mp3",
    "recordingSid": "RE123456789",
    "messageContent": "Patient message content",
    "tldr": "Summary of the message",
    "messageType": "voicemail",
    "priority": "medium",
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

#### 3.3 Get Doctor Messages (Different Doctor ID)

```bash
# Test with different doctor ID
curl -X GET http://localhost:3000/api/v1/doctors/2/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -v
```

### 4. Error Cases

#### 4.1 Invalid Patient ID

```bash
# Test with non-numeric patient ID
curl -X GET http://localhost:3000/api/v1/patients/invalid/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -v
```

#### 4.2 Invalid Doctor ID

```bash
# Test with non-numeric doctor ID
curl -X GET http://localhost:3000/api/v1/doctors/invalid/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -v
```

#### 4.3 Malformed JWT Token

```bash
# Test with malformed JWT token
curl -X GET http://localhost:3000/api/v1/patients/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid.jwt.token" \
  -v
```

### 5. Existing Endpoints (For Reference)

#### 5.1 Get All Messages (No Auth Required)

```bash
# Test existing messages endpoint
curl -X GET http://localhost:3000/api/v1/messages \
  -H "Content-Type: application/json" \
  -v
```

#### 5.2 Get All Patients (Auth Required)

```bash
# Test existing patients endpoint
curl -X GET http://localhost:3000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -v
```

#### 5.3 Get All Doctors (Auth Required)

```bash
# Test existing doctors endpoint
curl -X GET http://localhost:3000/api/v1/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -v
```

## Test Script

Here's a complete test script you can run:

```bash
#!/bin/bash

# Set your JWT token here
JWT_TOKEN="YOUR_JWT_TOKEN_HERE"
BASE_URL="http://localhost:3000"

echo "=== Testing Message Access API ==="
echo

echo "1. Health Check"
curl -X GET $BASE_URL/ -H "Content-Type: application/json"
echo -e "\n"

echo "2. Patient Messages (Unauthenticated - Should Fail)"
curl -X GET $BASE_URL/api/v1/patients/1/messages \
  -H "Content-Type: application/json"
echo -e "\n"

echo "3. Patient Messages (Authenticated)"
curl -X GET $BASE_URL/api/v1/patients/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN"
echo -e "\n"

echo "4. Doctor Messages (Unauthenticated - Should Fail)"
curl -X GET $BASE_URL/api/v1/doctors/1/messages \
  -H "Content-Type: application/json"
echo -e "\n"

echo "5. Doctor Messages (Authenticated)"
curl -X GET $BASE_URL/api/v1/doctors/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN"
echo -e "\n"

echo "6. All Messages (No Auth Required)"
curl -X GET $BASE_URL/api/v1/messages \
  -H "Content-Type: application/json"
echo -e "\n"

echo "=== Test Complete ==="
```

## Notes

1. **Replace `YOUR_JWT_TOKEN_HERE`** with a valid JWT token from your Auth0 setup
2. **Server must be running** on the specified port (default: 3000)
3. **Database must be set up** with some test data for meaningful responses
4. **Use `-v` flag** for verbose output to see HTTP headers and status codes
5. **Check console logs** for authorization middleware debug messages

## Expected Status Codes

- **200**: Success
- **401**: Unauthorized (missing or invalid JWT token)
- **500**: Internal Server Error (database issues, etc.)

## Troubleshooting

1. **"Connection refused"**: Server is not running
2. **"Unauthorized"**: JWT token is missing or invalid
3. **Empty array `[]`**: No messages found for the specified ID
4. **Database errors**: Check your database connection and migrations
