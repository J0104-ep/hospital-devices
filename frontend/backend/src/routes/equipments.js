// backend/src/routes/equipments.js
const express = require('express');
const router = express.Router();
const { Equipment } = require('../../models');
const multer = require('multer');
const path = require('path');

// === CONFIGURACIÓN DE MULTER ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// === GET → Listar todos los equipos ===
router.get('/', async (req, res) => {
  try {
    const equipments = await Equipment.findAll({
      order: [['createdAt', 'DESC']]
    });

    // ⚠️ No agregamos host aquí, solo devolvemos el path relativo
    res.json({
      success: true,
      equipments: equipments.map(eq => eq.toJSON())
    });
  } catch (error) {
    console.error('Error fetching equipments:', error);
    res.status(500).json({ error: 'Error al obtener los equipos' });
  }
});

// === POST → Registrar un nuevo equipo con imagen ===
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, brand, model, serial, ownerName, notes } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!type || !serial) {
      return res.status(400).json({ error: 'El tipo y el número de serie son obligatorios' });
    }

    const newEquipment = await Equipment.create({
      type,
      brand,
      model,
      serial,
      ownerName,
      notes,
      imageUrl
    });

    res.status(201).json({
      message: '✅ Equipo registrado exitosamente',
      equipment: newEquipment,
    });
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Error al registrar el equipo' });
  }
});

module.exports = router;
