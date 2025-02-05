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
      console.log('Пользователь с таким email уже существует');
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

    // Сохраняем userId в сессии
    req.session.userId = user.userId;
    console.log(`User ${user.userId} logged in. Session: `, req.session);

    res.status(200).json({ success: true, userId: user.userId });
  } catch (error) {
    console.error('Ошибка авторизации:', error.message);
    res.status(500).json({ success: false, error: 'Ошибка авторизации. Пожалуйста, попробуйте ещё раз.' });
  }
});

// Получить данные авторизованного пользователя
router.get('/user', async (req, res) => {
  console.log('Получение данных пользователя. Session: ', req.session);

  let userId = req.session.userId; // Предполагаем, что идентификатор пользователя хранится в сессии
  console.log('Полученный userId из сессии:', userId);

  if (!userId) {
    console.log('Пользователь не авторизован');
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }

  // Преобразование userId в число, если это строка
  userId = parseInt(userId, 10);

  if (isNaN(userId)) {
    console.error(`Ошибка получения пользователя: неверный синтаксис для типа integer: ${userId}`);
    return res.status(500).json({ error: `Ошибка получения пользователя: неверный синтаксис для типа integer: ${userId}` });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ['name', 'login', 'telephone', 'email']
    });
    if (!user) {
      console.log('Пользователь не найден');
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    console.log('Данные пользователя: ', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка получения данных пользователя' });
  }
});

// Обновить данные авторизованного пользователя
router.put('/user', async (req, res) => {
  let userId = req.session.userId; // Предполагаем, что идентификатор пользователя хранится в сессии
  const { name, login, telephone, email, password } = req.body;

  console.log('Обновление данных пользователя. Session: ', req.session);

  if (!userId) {
    console.log('Пользователь не авторизован');
    return res.status(401).json({ error: 'Пользователь не авторизован' });
  }

  // Преобразование userId в число, если это строка
  userId = parseInt(userId, 10);

  if (isNaN(userId)) {
    console.error(`Ошибка обновления данных пользователя: неверный синтаксис для типа integer: ${userId}`);
    return res.status(500).json({ error: `Ошибка обновления данных пользователя: неверный синтаксис для типа integer: ${userId}` });
  }

  try {
    const [updatedRows] = await User.update(
      { name, login, telephone, email, password },
      { where: { userId } }
    );
    if (updatedRows === 0) {
      console.log('Пользователь не найден');
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    console.log('Данные успешно обновлены');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка обновления данных пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка обновления данных пользователя' });
  }
});

// Удалить пользователя
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  // Преобразование userId в число
  const parsedUserId = parseInt(userId, 10);
  if (isNaN(parsedUserId)) {
    console.error(`Ошибка удаления пользователя: неверный синтаксис для типа integer: ${userId}`);
    return res.status(500).json({ error: `Ошибка удаления пользователя: неверный синтаксис для типа integer: ${userId}` });
  }

  try {
    const deletedRows = await User.destroy({ where: { userId: parsedUserId } });
    if (deletedRows === 0) {
      console.log('Пользователь не найден');
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    console.log('Пользователь успешно удален');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка удаления пользователя' });
  }
});

module.exports = router;