const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
const authenticateToken = require('../middleware/authenticateToken');

// Получить всю матрицу доступа
router.get('/', async (req, res) => {
  const roles = await sequelize.query('SELECT * FROM "Roles"', { type: QueryTypes.SELECT });
  const access = await sequelize.query('SELECT * FROM "RolePageAccess"', { type: QueryTypes.SELECT });
  res.json({ roles, access });
});

// Изменить доступ (установить/снять чекбокс)
router.put('/', async (req, res) => {
  const { roleId, page, allowed } = req.body;
  try {
    // Проверяем, есть ли уже запись
    const [existing] = await sequelize.query(
      'SELECT * FROM "RolePageAccess" WHERE "roleId" = :roleId AND "page" = :page',
      { replacements: { roleId, page }, type: QueryTypes.SELECT }
    );
    if (existing) {
      await sequelize.query(
        'UPDATE "RolePageAccess" SET "allowed" = :allowed WHERE "roleId" = :roleId AND "page" = :page',
        { replacements: { allowed, roleId, page }, type: QueryTypes.UPDATE }
      );
    } else {
      await sequelize.query(
        'INSERT INTO "RolePageAccess" ("roleId", "page", "allowed") VALUES (:roleId, :page, :allowed)',
        { replacements: { roleId, page, allowed }, type: QueryTypes.INSERT }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении прав доступа' });
  }
});

// Проверить доступ
router.get('/check', authenticateToken, async (req, res) => {
  const { page } = req.query;
  const roleId = req.user.roleId;
  if (!page || !roleId) return res.status(400).json({ allowed: false });
  const [access] = await sequelize.query(
    'SELECT "allowed" FROM "RolePageAccess" WHERE "roleId" = :roleId AND "page" = :page',
    { replacements: { roleId, page }, type: QueryTypes.SELECT }
  );
  res.json({ allowed: !!(access && access.allowed) });
});

module.exports = router;
