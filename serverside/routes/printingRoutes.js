const express = require('express');
const router = express.Router();
const Printing = require('../models/Printing');

// Маршрут для получения всех опций печати
router.get('/', async (req, res) => {
  try {
    const printingOptions = await Printing.findAll();
    console.log('Данные из базы данных:', printingOptions); // Лог данных из базы данных
    res.json(printingOptions);
  } catch (error) {
    console.error('Ошибка при получении данных из базы данных:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;