const express = require('express');
const router = express.Router();
const Photostudios = require('../models/Photostudios');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Настройка multer для загрузки файлов в папку Photостudios
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Жестко указываем абсолютный путь для Windows
        cb(null, 'C:\\Users\\Max\\Documents\\УЧЕБА\\graduation\\photoproject\\src\\components\\assets\\images\\Photostudios');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 МБ
});

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
        const studioData = { ...req.body };
        // Логируем отправленные данные
        console.log('Данные, полученные для добавления фотостудии:', studioData);

        // Если поле photo отсутствует или пустое, но был загружен файл, пробуем взять последний файл из папки
        if (!studioData.photo || studioData.photo === '') {
            // Можно реализовать автоопределение, но лучше всегда отправлять путь с фронта!
            // Оставляем photo пустым, если не было загрузки
            studioData.photo = '';
        }

        const newStudio = await Photostudios.create(studioData);
        console.log('Добавлена новая фотостудия:', newStudio);
        res.status(201).json(newStudio);
    } catch (error) {
        console.error('Ошибка при добавлении данных:', error);
        res.status(500).json({ error: 'Ошибка при добавлении данных' });
    }
});

// Обновление фотостудии
router.put('/:id', async (req, res) => {
    try {
        const studioId = req.params.id;
        const [updated] = await Photostudios.update(req.body, { where: { id: studioId } });
        if (updated) {
            const updatedStudio = await Photostudios.findByPk(studioId);
            res.status(200).json(updatedStudio);
        } else {
            res.status(404).json({ error: 'Фотостудия не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при обновлении фотостудии:', error);
        res.status(500).json({ error: 'Ошибка при обновлении фотостудии' });
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

// Загрузка фотографии фотостудии
router.post('/upload', (req, res) => {
    upload.single('photo')(req, res, function (err) {
        if (err) {
            console.error('Ошибка загрузки файла:', err);
            return res.status(500).json({ error: 'Ошибка загрузки файла', details: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }
        // Сохраняем путь для фронта (относительно public/static)
        const photoPath = `/src/components/assets/images/Photostudios/${req.file.originalname}`;
        res.json({ filename: photoPath });
    });
});

module.exports = router;