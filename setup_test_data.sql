-- Test Data Setup for Message Access API
-- Run this SQL script to insert sample data for testing

-- Insert sample doctors
INSERT INTO doctors (name, phone, available, created_at) VALUES
('Dr. Smith', '+1234567890', true, NOW()),
('Dr. Johnson', '+1234567891', true, NOW()),
('Dr. Williams', '+1234567892', false, NOW());

-- Insert sample patients
INSERT INTO patients (name, phone, created_at) VALUES
('John Doe', '+0987654321', NOW()),
('Jane Smith', '+0987654322', NOW()),
('Bob Johnson', '+0987654323', NOW());

-- Insert sample messages
INSERT INTO messages (idDoctor, idPatient, audioUrl, recordingSid, messageContent, tldr, messageType, priority, status, isProcessed, created_at, updated_at) VALUES
-- Messages for Dr. Smith (idDoctor: 1)
(1, 1, 'https://example.com/audio1.mp3', 'RE123456789', 'I have been experiencing chest pain for the past week', 'Patient reports chest pain for one week', 'voicemail', 'high', 'unread', true, NOW(), NOW()),
(1, 2, 'https://example.com/audio2.mp3', 'RE123456790', 'My blood pressure medication is not working well', 'Patient reports blood pressure medication issues', 'voicemail', 'medium', 'read', true, NOW(), NOW()),
(1, 3, 'https://example.com/audio3.mp3', 'RE123456791', 'I need a refill for my prescription', 'Patient requests prescription refill', 'voicemail', 'low', 'responded', true, NOW(), NOW()),

-- Messages for Dr. Johnson (idDoctor: 2)
(2, 1, 'https://example.com/audio4.mp3', 'RE123456792', 'Follow-up on my recent surgery', 'Patient follow-up on surgery', 'voicemail', 'medium', 'unread', true, NOW(), NOW()),
(2, 2, 'https://example.com/audio5.mp3', 'RE123456793', 'I have questions about my test results', 'Patient has questions about test results', 'voicemail', 'high', 'unread', true, NOW(), NOW()),

-- Messages for Dr. Williams (idDoctor: 3)
(3, 3, 'https://example.com/audio6.mp3', 'RE123456794', 'Emergency consultation needed', 'Patient needs emergency consultation', 'voicemail', 'urgent', 'unread', false, NOW(), NOW()),

-- Text messages
(1, 1, NULL, NULL, 'Thank you for the consultation yesterday', 'Patient thanks doctor for consultation', 'text', 'low', 'read', true, NOW(), NOW()),
(2, 2, NULL, NULL, 'Can we schedule an appointment for next week?', 'Patient requests appointment scheduling', 'text', 'medium', 'unread', true, NOW(), NOW()),

-- Email messages
(1, 3, NULL, NULL, 'Please find attached my latest lab results', 'Patient shares lab results via email', 'email', 'medium', 'read', true, NOW(), NOW());

-- Verify the data
SELECT 'Doctors:' as info;
SELECT * FROM doctors;

SELECT 'Patients:' as info;
SELECT * FROM patients;

SELECT 'Messages:' as info;
SELECT 
    m.idMessage,
    m.idDoctor,
    d.name as doctor_name,
    m.idPatient,
    p.name as patient_name,
    m.messageType,
    m.priority,
    m.status,
    m.created_at
FROM messages m
JOIN doctors d ON m.idDoctor = d.idDoctor
JOIN patients p ON m.idPatient = p.idPatient
ORDER BY m.created_at DESC;
