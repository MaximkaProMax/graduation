const express = require('express');
const router = express.Router();
const Favourites = require('../models/Favourites');
const Photostudios = require('../models/Photostudios');
const jwt = require('jsonwebtoken');

// Middleware для проверки JWT токенов
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Получение избранных фотостудий для пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Получение избранных фотостудий для пользователя с ID:', userId);
    const favourites = await Favourites.findAll({
      where: { user_id: userId },
      include: [Photostudios]
    });
    console.log('Избранные фотостудии:', favourites);
    res.json(favourites.map(fav => fav.photostudio));
  } catch (err) {
    console.error('Ошибка при получении избранных фотостудий:', err);
    res.status(500).json({ error: err.message });
  }
});

// Добавление фотостудии в избранное
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { studio_id } = req.body;

    // Проверка на наличие фотостудии в избранном
    const existingFavourite = await Favourites.findOne({
      where: { user_id: userId, studio_id }
    });

    if (existingFavourite) {
      return res.status(400).json({ message: 'Фотостудия уже в избранном' });
    }

    console.log('Добавление фотостудии в избранное:', { user_id: userId, studio_id });
    await Favourites.create({ user_id: userId, studio_id });
    res.status(201).json({ message: 'Added to favourites' });
  } catch (err) {
    console.error('Ошибка при добавлении фотостудии в избранное:', err);
    res.status(500).json({ error: err.message });
  }
});

// Удаление фотостудии из избранного
router.delete('/:studio_id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { studio_id } = req.params;
    console.log('Удаление фотостудии из избранного:', { user_id: userId, studio_id });
    await Favourites.destroy({
      where: {
        user_id: userId,
        studio_id
      }
    });
    res.status(200).json({ message: 'Removed from favourites' });
  } catch (err) {
    console.error('Ошибка при удалении фотостудии из избранного:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;