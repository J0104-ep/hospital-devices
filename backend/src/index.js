// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('../models');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;

// === MIDDLEWARES ===
// 👇 Configuración CORS actualizada para permitir peticiones desde tu frontend en Render
app.use(cors({
  origin: [
    'https://hospital-devices-1.onrender.com', // ✅ tu frontend real en Render
    'https://hospital-devices.onrender.com',    // por si cambias dominio
    'http://localhost:3000'                     // desarrollo local
  ],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === SERVIR IMÁGENES SUBIDAS ===
app.use('/uploads', express.static('uploads')); // 👈 Carpeta pública

// === JWT Middleware ===
const verifyJwt = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// === ROUTES ===
const authRouter = require('./routes/auth');
const equipmentsRouter = require('./routes/equipments');
const transactionsRouter = require('./routes/transactions');

app.use('/api/auth', authRouter);
app.use('/api/equipments', verifyJwt, equipmentsRouter);
app.use('/api/transactions', verifyJwt, transactionsRouter);

// === RUTA DE PRUEBA JWT ===
app.get('/api/protected', verifyJwt, (req, res) => {
  res.json({ ok: true, user: req.user });
});

// === RUTA PRINCIPAL ===
app.get('/', (req, res) => {
  res.json({ ok: true, message: '✅ Hospital Devices API funcionando correctamente' });
});

// === SERVER START ===
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected successfully');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
});
