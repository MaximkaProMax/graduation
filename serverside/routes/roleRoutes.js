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

// Обновить роль и права доступа
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { roleName, permissions } = req.body;

  console.log('Получен запрос на обновление роли:', { id, roleName, permissions }); // Отладочное сообщение

  try {
    const replacements = { id };

    // Формируем запрос для обновления
    let query = 'UPDATE "Roles" SET';

    if (roleName !== undefined) {
      query += ' "roleName" = :roleName,';
      replacements.roleName = roleName;
    }

    if (permissions !== undefined) {
      query += ' "permissions" = :permissions,';
      replacements.permissions = JSON.stringify(permissions); // Преобразуем объект в строку JSON
    }

    // Убираем последнюю запятую
    query = query.replace(/,$/, '');

    query += ' WHERE "roleId" = :id RETURNING *';

    // Выполняем запрос
    const [result] = await sequelize.query(query, {
      replacements,
      type: QueryTypes.UPDATE,
    });

    console.log('Результат обновления роли:', result); // Отладочное сообщение

    res.json({ success: true, message: 'Роль и права доступа успешно обновлены', role: result[0] });
  } catch (error) {
    console.error('Ошибка при обновлении роли:', error);
    res.status(500).json({ error: 'Ошибка сервера при обновлении роли' });
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

// Удалить страницу из прав доступа
router.delete('/:roleId/page', async (req, res) => {
  const { roleId } = req.params;
  const { page } = req.body;

  if (!page) {
    return res.status(400).json({ error: 'Не указана страница для удаления' });
  }

  try {
    const [role] = await sequelize.query(
      'SELECT "permissions" FROM "Roles" WHERE "roleId" = :roleId',
      {
        replacements: { roleId },
        type: QueryTypes.SELECT,
      }
    );

    if (!role) {
      return res.status(404).json({ error: 'Роль не найдена' });
    }

    const permissions = role.permissions || {};
    const roleName = Object.keys(permissions)[0]; // Предполагаем, что ключ — это имя роли

    if (!permissions[roleName]?.includes(page)) {
      return res.status(400).json({ error: 'Страница не найдена в правах доступа' });
    }

    // Удаляем страницу из массива
    permissions[roleName] = permissions[roleName].filter((p) => p !== page);

    // Обновляем права доступа в БД
    await sequelize.query(
      'UPDATE "Roles" SET "permissions" = :permissions WHERE "roleId" = :roleId',
      {
        replacements: { permissions: JSON.stringify(permissions), roleId },
        type: QueryTypes.UPDATE,
      }
    );

    res.json({ success: true, message: `Страница "${page}" успешно удалена` });
  } catch (error) {
    console.error('Ошибка при удалении страницы из прав доступа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;