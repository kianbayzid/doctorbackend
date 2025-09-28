import express from 'express';
import DoctorService from '../services/doctor.service.js';
import MessageService from '../services/message.service.js';
import { checkDoctorOwnership } from '../middleware/auth.middleware.js';

const router = express.Router();
const service = new DoctorService();
const messageService = new MessageService();

router.get('/', async (req, res, next) => {
  try {
    const doctors = await service.find();
    res.json(doctors);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await service.findOne(id);
    res.json(doctor);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newDoctor = await service.create(body);
    res.status(201).json(newDoctor);
  } catch (err) {
    console.error(err);
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

// Get all messages for a specific doctor
router.get('/:id/messages', checkDoctorOwnership, async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await messageService.findByDoctor(id);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

export default router;