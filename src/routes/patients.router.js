import express from 'express';
import PatientService from '../services/patient.service.js';
import MessageService from '../services/message.service.js';
import { checkPatientOwnership } from '../middleware/auth.middleware.js';

const router = express.Router();
const service = new PatientService();
const messageService = new MessageService();

router.get('/', async (req, res, next) => {
  try {
    const patients = await service.find();
    res.json(patients);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await service.findOne(id);
    res.json(patient);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newPatient = await service.create(body);
    res.status(201).json(newPatient);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updated = await service.update(id, body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.delete(id);
    res.json({ id });
  } catch (err) {
    next(err);
  }
});

// Get all messages for a specific patient
router.get('/:id/messages', checkPatientOwnership, async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await messageService.findByPatient(id);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

export default router;