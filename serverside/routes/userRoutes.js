// routes/userRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error.message);
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
});

// Получить пользователя по ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка получения пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка получения пользователя' });
  }
});

// Создать нового пользователя
router.post('/', async (req, res) => {
  try {
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      ...req.body,
      password: hashedPassword,
    };
    const user = await User.create(userData);
    res.status(201).json(user);
  } catch (error) {
    console.error('Ошибка создания пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка создания пользователя' });
  }
});

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { fullName, login, phone, password, email } = req.body;

  try {
    // Проверка существования пользователя
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
      roleId: 2, // Роль по умолчанию (например, User)
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

// Обновить пользователя
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [updatedRows] = await User.update(req.body, { where: { userId } });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка обновления пользователя' });
  }
});

// Удалить пользователя
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedRows = await User.destroy({ where: { userId } });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка удаления пользователя' });
  }
});

module.exports = router;