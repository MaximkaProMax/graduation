const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const pool = require('../config/database'); // Импортируем настройку подключения к базе данных

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { fullName, login, phone, password, email } = req.body;

  try {
    // Проверка, существует ли уже email или логин
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Пользователь с таким email уже существует.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: fullName,
      login,
      telephone: phone,
      password: hashedPassword,
      email,
      roleId: 2 // Пример: установить роль по умолчанию (User)
    });

    res.status(201).json({ success: true, userId: user.userId });
  } catch (error) {
    console.error('Ошибка регистрации:', error.message);
    res.status(500).json({ success: false, error: 'Ошибка регистрации. Пожалуйста, попробуйте ещё раз.' });
  }
});

// Авторизация пользователя
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Неверный логин или пароль.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, error: 'Неверный логин или пароль.' });
    }

    res.status(200).json({ success: true, userId: user.userId });
  } catch (error) {
    console.error('Ошибка авторизации:', error.message);
    res.status(500).json({ success: false, error: 'Ошибка авторизации. Пожалуйста, попробуйте ещё раз.' });
  }
});

// Маршрут для получения всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM "Users"');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Маршрут для обновления роли пользователя
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;
    const updateUser = await pool.query('UPDATE "Users" SET "roleId" = $1 WHERE "userId" = $2 RETURNING *', [roleId, id]);
    res.json(updateUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Маршрут для добавления нового пользователя
router.post('/', async (req, res) => {
  try {
    const { name, roleId } = req.body;
    const newUser = await pool.query('INSERT INTO "Users" (name, "roleId") VALUES ($1, $2) RETURNING *', [name, roleId]);
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Маршрут для удаления пользователя
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM "Users" WHERE "userId" = $1', [id]);
    res.json({ message: 'Пользователь удален' });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;