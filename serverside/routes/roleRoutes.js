const express = require('express');
const router = express.Router();
const sequelize = require('../config/database'); // Импортируем настройку подключения к базе данных

// Маршрут для получения всех ролей
router.get('/', async (req, res) => {
  try {
    console.log('Запрос к базе данных перед выполнением: SELECT * FROM "Roles"');
    const [roles, metadata] = await sequelize.query('SELECT * FROM "Roles"');
    console.log('Роли, возвращенные с сервера:', roles); // Отладочный вывод конкретных данных

    if (roles && roles.length > 0) {
      res.json(roles);
    } else {
      console.log('Нет ролей в базе данных');
      res.status(204).send();
    }
  } catch (err) {
    console.error('Ошибка при получении данных о ролях:', err.message);
    res.status(500).json({ error: 'Ошибка при получении данных о ролях' });
  }
});

module.exports = router;