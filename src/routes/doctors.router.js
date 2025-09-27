import express from 'express';
import DoctorService from '../services/doctor.service.js';

const router = express.Router();
const service = new DoctorService();

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

export default router;