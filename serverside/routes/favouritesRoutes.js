const express = require('express');
const router = express.Router();
const Favourites = require('../models/Favourites');
const Photostudios = require('../models/Photostudios');
const { Op } = require('sequelize');

// Получение избранных фотостудий для пользователя
router.get('/', async (req, res) => {
  try {
    const userId = 17; // Используем фиксированный userId для тестирования
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
router.post('/', async (req, res) => {
  try {
    const userId = 17; // Используем фиксированный userId для тестирования
    const { studio_id } = req.body;
    console.log('Добавление фотостудии в избранное:', { user_id: userId, studio_id });
    await Favourites.create({ user_id: userId, studio_id });
    res.status(201).json({ message: 'Added to favourites' });
  } catch (err) {
    console.error('Ошибка при добавлении фотостудии в избранное:', err);
    res.status(500).json({ error: err.message });
  }
});

// Удаление фотостудии из избранного
router.delete('/:studio_id', async (req, res) => {
  try {
    const userId = 17; // Используем фиксированный userId для тестирования
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