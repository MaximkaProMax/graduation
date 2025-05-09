const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// Получить права доступа для всех ролей
router.get('/', async (req, res) => {
  try {
    const roles = await Role.findAll({ attributes: ['roleId', 'roleName', 'permissions'] });
    res.json(roles);
  } catch (error) {
    console.error('Ошибка при получении прав доступа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить права доступа для роли
router.put('/:roleId', async (req, res) => {
  const { roleId } = req.params;
  const { permissions } = req.body;

  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ error: 'Роль не найдена' });
    }

    role.permissions = permissions;
    await role.save();

    res.json({ success: true, message: 'Права доступа обновлены' });
  } catch (error) {
    console.error('Ошибка при обновлении прав доступа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
