const express = require('express');
const router = express.Router();
const { BookingTypographie } = require('../models/BookingTypographie');
const { BookingStudio } = require('../models/BookingStudio');

// Получение всех заказов из таблиц booking_typographie и booking_photostudios
router.get('/', async (req, res) => {
  try {
    // Получаем данные из таблицы booking_typographie
    const typographyBookings = await BookingTypographie.findAll();

    // Получаем данные из таблицы booking_photostudios
    const studioBookings = await BookingStudio.findAll();

    // Объединяем данные в один объект
    res.status(200).json({
      typographyBookings,
      studioBookings,
    });
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении заказов' });
  }
});

module.exports = router;