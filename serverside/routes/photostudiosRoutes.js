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

// Удаление фотостудии
router.delete('/:id', async (req, res) => {
    try {
        const studioId = req.params.id;
        const deleted = await Photostudios.destroy({ where: { id: studioId } });
        if (deleted) {
            res.status(200).json({ success: true, message: 'Фотостудия успешно удалена' });
        } else {
            res.status(404).json({ success: false, message: 'Фотостудия не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при удалении фотостудии:', error);
        res.status(500).json({ success: false, message: 'Ошибка при удалении фотостудии' });
    }
});

module.exports = router;