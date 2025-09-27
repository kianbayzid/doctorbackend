import express from 'express';
import MessageService from '../services/message.service.js';

const router = express.Router();
const service = new MessageService();

// Get all messages
router.get('/', async (req, res, next) => {
  try {
    const messages = await service.find();
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// Get a specific message
router.get('/:idMessage', async (req, res, next) => {
  try {
    const { idMessage } = req.params;
    const message = await service.findOne(idMessage);
    res.json(message);
  } catch (err) {
    next(err);
  }
});

// Create a new message
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newMessage = await service.create(body);
    res.status(201).json({
      ...newMessage.toJSON(),
      note: 'TLDR will be generated automatically and updated shortly'
    });
  } catch (err) {
    next(err);
  }
});

// Update a message
router.patch('/:idMessage', async (req, res, next) => {
  try {
    const { idMessage } = req.params;
    const body = req.body;
    const updated = await service.update(idMessage, body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete a message
router.delete('/:idMessage', async (req, res, next) => {
  try {
    const { idMessage } = req.params;
    await service.delete(idMessage);
    res.json({ idMessage });
  } catch (err) {
    next(err);
  }
});

export default router;
