import express from 'express';
import MessageService from '../services/message.service.js';
import axios from "axios";


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

router.get("/:idMessage/audio", async (req, res, next) => {
  try {
    const { idMessage } = req.params;

    // Acá buscás el mensaje en tu DB para obtener el `audioUrl`
    const message = await req.app.get("models").Message.findByPk(idMessage);

    if (!message || !message.audioUrl) {
      return res.status(404).json({ error: "Audio not found" });
    }

    // 🔑 Usás tus credenciales de Twilio en el backend
    const response = await axios.get(message.audioUrl, {
      responseType: "stream",
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID,
        password: process.env.TWILIO_AUTH_TOKEN,
      },
    });

    res.setHeader("Content-Type", "audio/mpeg");
    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:idMessage/audio", async (req, res, next) => {
  try {
    const { idMessage } = req.params;
    const message = await service.findOne(idMessage);

    if (!message || !message.audioUrl) {
      return res.status(404).json({ error: "Audio not found" });
    }

    const response = await axios.get(message.audioUrl, {
      responseType: "stream",
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID,
        password: process.env.TWILIO_AUTH_TOKEN,
      },
    });

    res.setHeader("Content-Type", "audio/mpeg");
    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/doctor/:doctorId', async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const messages = await service.findByDoctor(doctorId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

export default router;
