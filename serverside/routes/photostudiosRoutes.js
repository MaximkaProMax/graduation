const express = require('express');
const router = express.Router();
const Photostudios = require('../models/Photostudios');

// Получение всех фотостудий
router.get('/', async (req, res) => {
    try {
        const studios = await Photostudios.findAll();
        console.log('Данные из базы данных:', studios); // Лог данных из базы данных
        res.json(studios);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});

// Добавление новой фотостудии
router.post('/', async (req, res) => {
    try {
        const newStudio = await Photostudios.create(req.body);
        console.log('Добавлена новая фотостудия:', newStudio); // Лог добавления новой фотостудии
        res.status(201).json(newStudio);
    } catch (error) {
        console.error('Ошибка при добавлении данных:', error);
        res.status(500).json({ error: 'Ошибка при добавлении данных' });
    }
});

module.exports = router;