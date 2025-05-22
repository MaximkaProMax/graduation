const express = require('express');
const router = express.Router();
const Favourites = require('../models/Favourites');
const Photostudios = require('../models/Photostudios');
const Printing = require('../models/Printing'); // Импорт модели Printing
const authenticateToken = require('../middleware/authenticateToken');

// Получение избранных фотостудий и типографий для пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Получение избранного для пользователя с ID:', userId);
    const favourites = await Favourites.findAll({
      where: { user_id: userId },
      include: [Photostudios, Printing]
    });

    const result = favourites.map(fav => {
      if (fav.photostudio) {
        return { type: 'photostudio', ...fav.photostudio.dataValues };
      } else if (fav.printing) {
        return { type: 'printing', ...fav.printing.dataValues };
      }
      return null;
    }).filter(item => item !== null);

    console.log('Избранное:', result);
    res.json(result);
  } catch (err) {
    console.error('Ошибка при получении избранного:', err);
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

// Добавление типографии в избранное
router.post('/printing', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { printing_id } = req.body;

    // Проверка на наличие типографии в избранном
    const existingFavourite = await Favourites.findOne({
      where: { user_id: userId, printing_id }
    });

    if (existingFavourite) {
      return res.status(400).json({ message: 'Типография уже в избранном' });
    }

    console.log('Добавление типографии в избранное:', { user_id: userId, printing_id });
    await Favourites.create({ user_id: userId, printing_id, studio_id: null }); // Указан null для studio_id
    res.status(201).json({ message: 'Added to favourites' });
  } catch (err) {
    console.error('Ошибка при добавлении типографии в избранное:', err);
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

// Удаление типографии из избранного
router.delete('/printing/:printing_id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { printing_id } = req.params;
    console.log('Удаление типографии из избранного:', { user_id: userId, printing_id });
    await Favourites.destroy({
      where: {
        user_id: userId,
        printing_id
      }
    });
    res.status(200).json({ message: 'Removed from favourites' });
  } catch (err) {
    console.error('Ошибка при удалении типографии из избранного:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;