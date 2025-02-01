const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
const User = require('../models/User'); // Импортируем модель User для проверки

// Получить все роли
router.get('/', async (req, res) => {
  try {
    const [roles] = await sequelize.query('SELECT * FROM "Roles"');
    res.json(roles);
  } catch (err) {
    console.error('Ошибка при получении ролей:', err.message);
    res.status(500).json({ error: 'Ошибка при получении ролей' });
  }
});

// Добавить новую роль
router.post('/', async (req, res) => {
  const { roleName } = req.body;
  try {
    const [result] = await sequelize.query(
      'INSERT INTO "Roles" ("roleName") VALUES (:roleName) RETURNING *',
      {
        replacements: { roleName },
        type: QueryTypes.INSERT,
      }
    );
    res.json(result[0]);
  } catch (err) {
    console.error('Ошибка при добавлении роли:', err.message);
    res.status(500).json({ error: 'Ошибка при добавлении роли' });
  }
});

// Обновить роль
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { roleName } = req.body;
  try {
    const [result] = await sequelize.query(
      'UPDATE "Roles" SET "roleName" = :roleName WHERE "roleId" = :id RETURNING *',
      {
        replacements: { roleName, id },
        type: QueryTypes.UPDATE,
      }
    );
    res.json(result[0]);
  } catch (err) {
    console.error('Ошибка при обновлении роли:', err.message);
    res.status(500).json({ error: 'Ошибка при обновлении роли' });
  }
});

// Удалить роль
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Проверка, используется ли роль каким-либо пользователем
    const usersWithRole = await User.findAll({ where: { roleId: id } });
    if (usersWithRole.length > 0) {
      return res.status(400).json({ error: 'Невозможно удалить роль, так как она используется пользователями.' });
    }

    await sequelize.query(
      'DELETE FROM "Roles" WHERE "roleId" = :id',
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка при удалении роли:', err.message);
    res.status(500).json({ error: 'Ошибка при удалении роли' });
  }
});

module.exports = router;