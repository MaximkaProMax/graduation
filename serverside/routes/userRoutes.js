const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

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
      role: 'user'
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

module.exports = router;