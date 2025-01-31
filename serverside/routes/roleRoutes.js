const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Импортируем настройку подключения к базе данных

// Маршрут для получения всех ролей
router.get('/', async (req, res) => {
  try {
    console.log('Запрос к базе данных перед выполнением: SELECT * FROM "Roles"');
    const roles = await pool.query('SELECT * FROM "Roles"');
    console.log('Полный ответ от базы данных:', roles); // Отладочный вывод всей структуры ответа
    console.log('Роли, возвращенные с сервера:', roles.rows); // Отладочный вывод конкретных данных
    if (roles.rows && roles.rows.length > 0) {
      res.json(roles.rows);
    } else {
      console.log('Нет ролей в базе данных');
      res.status(204).json({ error: 'Нет данных' });
    }
  } catch (err) {
    console.error('Ошибка при получении данных о ролях:', err.message);
    res.status(500).json({ error: 'Ошибка при получении данных о ролях' });
  }
});

module.exports = router;