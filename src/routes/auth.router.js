// src/routes/auth.router.js
import express from 'express';
import bcrypt from 'bcrypt';
import sequelize from '../libs/sequelize.js';

const { models } = sequelize;
const router = express.Router();

// Registro de doctor
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, specialization } = req.body;

    // Validar campos obligatorios
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verificar si ya existe un doctor con ese email
    const existingDoctor = await models.Doctor.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear doctor
    const newDoctor = await models.Doctor.create({
      name,
      email,
      password: hashedPassword,
      phone,
      specialization,
      available: true,
    });

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: {
        idDoctor: newDoctor.idDoctor,
        name: newDoctor.name,
        email: newDoctor.email,
        phone: newDoctor.phone,
        specialization: newDoctor.specialization,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register doctor' });
  }
});

// Login de doctor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar doctor por email
    const doctor = await models.Doctor.findOne({ where: { email } });
    if (!doctor) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Login exitoso
    res.json({
      message: 'Login successful',
      doctor: {
        idDoctor: doctor.idDoctor,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;