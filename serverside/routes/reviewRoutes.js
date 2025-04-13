const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware для проверки JWT токенов
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log('Токен отсутствует в cookies');
    return res.status(401).json({ message: 'Неавторизованный доступ' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('Ошибка проверки токена:', err.message);
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    req.user = user;
    console.log('Пользователь авторизован:', user);
    next();
  });
};

// Получение всех отзывов (доступно для всех пользователей)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['name'],
        },
      ],
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление нового отзыва (только для авторизованных пользователей)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Получаем userId из декодированного токена

    const { photostudio, printing, rating, comment } = req.body; // Удалено поле feedback

    // Создаем отзыв
    const review = await Review.create({
      user_id: userId,
      photostudio,
      printing,
      rating,
      comment,
    });

    // Загружаем данные о пользователе для созданного отзыва
    const fullReview = await Review.findOne({
      where: { review_id: review.review_id },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['name'],
        },
      ],
    });

    res.status(201).json({ success: true, review: fullReview });
  } catch (error) {
    console.error('Ошибка при добавлении отзыва:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;