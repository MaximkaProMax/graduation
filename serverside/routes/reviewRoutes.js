const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');

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

// Удаление отзыва (только для авторизованных пользователей)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId; // Получаем ID текущего пользователя из токена

    // Проверяем, принадлежит ли отзыв текущему пользователю
    const review = await Review.findOne({ where: { review_id: reviewId, user_id: userId } });

    if (!review) {
      return res.status(403).json({ message: 'Вы не можете удалить этот отзыв' });
    }

    // Удаляем отзыв
    await Review.destroy({ where: { review_id: reviewId } });

    res.status(200).json({ success: true, message: 'Отзыв успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении отзыва:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;