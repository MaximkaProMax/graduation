const express = require('express');
const router = express.Router();
const { BookingTypographie } = require('../models/BookingTypographie');
const jwt = require('jsonwebtoken');

// Middleware для проверки JWT токенов
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Получаем токен из cookies
  if (!token) return res.status(401).json({ success: false, message: 'Не авторизован' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Доступ запрещён' });
    req.user = user; // Добавляем данные пользователя в запрос
    next();
  });
};

// Добавление нового бронирования
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Получаем ID пользователя из токена
    const { format, spreads, lamination, quantity, price, albumName } = req.body;

    // Проверяем, что все необходимые данные присутствуют
    if (!format || !spreads || !lamination || !quantity || !price || !albumName) {
      return res.status(400).json({ success: false, message: 'Все поля должны быть заполнены' });
    }

    const newBooking = await BookingTypographie.create({
      user: userId,
      status: 'В обработке',
      format,
      the_basis_of_the_spread: 'Не указано', // Значение по умолчанию
      number_of_spreads: spreads,
      lamination,
      number_of_copies: quantity,
      final_price: price,
      album_name: albumName,
      address_delivery: 'Не указано', // Можно заменить на реальное значение
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Ошибка при добавлении бронирования:', error);
    res.status(500).json({ success: false, message: 'Ошибка при добавлении бронирования' });
  }
});

// Получение всех бронирований авторизованного пользователя
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Получаем ID пользователя из токена

    const bookings = await BookingTypographie.findAll({
      where: { user: userId },
    });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении бронирований' });
  }
});

// Удаление бронирования
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const deleted = await BookingTypographie.destroy({
      where: { booking_typographie_id: bookingId, user: req.user.userId },
    });

    if (deleted) {
      res.status(200).json({ success: true, message: 'Заявка успешно удалена' });
    } else {
      res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при удалении заявки:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении заявки' });
  }
});

module.exports = router;