# Message Access API

This document describes the new message access endpoints that allow patients and doctors to view their respective messages.

## Endpoints

### Patient Messages

**GET** `/api/v1/patients/:id/messages`

Retrieves all messages for a specific patient.

**Authentication:** Required (JWT Bearer token)

**Authorization:** The authenticated user must be authorized to access the specified patient's messages.

**Response:**
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

### Doctor Messages

**GET** `/api/v1/doctors/:id/messages`

Retrieves all messages for a specific doctor.

**Authentication:** Required (JWT Bearer token)

**Authorization:** The authenticated user must be authorized to access the specified doctor's messages.

**Response:**
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

## Security

Both endpoints are protected by:

1. **JWT Authentication:** A valid JWT token must be provided in the Authorization header
2. **Authorization Middleware:** The middleware checks that the authenticated user is authorized to access the requested resource

## Usage Examples

### Frontend Integration

```javascript
// Get patient messages
const getPatientMessages = async (patientId, token) => {
  const response = await fetch(`/api/v1/patients/${patientId}/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch patient messages');
  }
  
  return response.json();
};

// Get doctor messages
const getDoctorMessages = async (doctorId, token) => {
  const response = await fetch(`/api/v1/doctors/${doctorId}/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch doctor messages');
  }
  
  return response.json();
};
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "No user ID found in token"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error checking patient/doctor ownership"
}
```

## Notes

- Messages are returned in descending order by creation date (newest first)
- Each message includes associated doctor and patient information
- The authorization middleware currently logs access attempts for debugging
- In production, you should implement proper user-to-patient/doctor mapping in the authorization middleware
