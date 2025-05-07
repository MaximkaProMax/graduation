const express = require('express');
const router = express.Router();
const { BookingByPhone } = require('../models/BookingByPhone');

// Получить все заявки
router.get('/', async (req, res) => {
  try {
    const bookings = await BookingByPhone.findAll();
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при получении заявок' });
  }
});

// Добавить новую заявку
router.post('/add', async (req, res) => {
  try {
    const { full_name, telephone, photostudio, printing, comment, status } = req.body;
    if (!full_name || !telephone) {
      return res.status(400).json({ success: false, message: 'ФИО и телефон обязательны' });
    }
    const booking = await BookingByPhone.create({
      full_name,
      telephone,
      photostudio,
      printing,
      comment,
      status: status || 'Новая',
    });
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при добавлении заявки' });
  }
});

// Обновить заявку
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { full_name, telephone, photostudio, printing, comment, status } = req.body;
    const [updated] = await BookingByPhone.update(
      { full_name, telephone, photostudio, printing, comment, status },
      { where: { booking_by_phone_id: id } }
    );
    if (updated) {
      res.json({ success: true, message: 'Заявка обновлена' });
    } else {
      res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при обновлении заявки' });
  }
});

// Удалить заявку
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await BookingByPhone.destroy({ where: { booking_by_phone_id: id } });
    if (deleted) {
      res.json({ success: true, message: 'Заявка удалена' });
    } else {
      res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при удалении заявки' });
  }
});

module.exports = router;
