const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
const { generateTwoFactorCode, verifyTwoFactorCode } = require('../services/twoFactorAuth');
const User = require('../models/User');
const router = express.Router();

// Middleware для проверки JWT токенов
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Маршрут для получения всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут для добавления нового пользователя
router.post('/', async (req, res) => {
  const { name, login, telephone, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      login,
      telephone,
      email,
      password: hashedPassword
    });

    res.json({ success: true, message: 'Пользователь успешно добавлен' });
  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { name, login, phone, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      login,
      phone,
      email,
      password: hashedPassword,
      role
    });

    res.json({ success: true, message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({ success: false, message: 'Ошибка при регистрации пользователя' });
  }
});

// Авторизация пользователя
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Неверный пароль' });
    }

    const code = generateTwoFactorCode();
    await sendEmail(email, 'Ваш код двухфакторной аутентификации', `Ваш код для входа: ${code}`);

    res.json({ success: true, twoFactorRequired: true });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Получить данные авторизованного пользователя
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
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

// Обновить пароль пользователя
router.put('/update-password', authenticateToken, async (req, res) => {
  const { name, login, telephone, email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Текущий пароль неверен' });
    }

    user.name = name;
    user.login = login;
    user.telephone = telephone;
    user.email = email;

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({ success: true, message: 'Данные пользователя успешно обновлены' });
  } catch (error) {
    console.error('Ошибка при обновлении данных пользователя:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Маршрут для обновления существующего пользователя
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, login, telephone, email, password } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.name = name;
    user.login = login;
    user.telephone = telephone;
    user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ success: true, message: 'Пользователь успешно обновлен' });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут для удаления пользователя
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await user.destroy();

    res.json({ success: true, message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/send-2fa-code', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    const code = generateTwoFactorCode();
    await sendEmail(email, 'Ваш код двухфакторной аутентификации', `Ваш код: ${code}`);

    res.json({ success: true, message: 'Код отправлен на вашу электронную почту' });
  } catch (error) {
    console.error('Ошибка при отправке кода 2FA:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

router.post('/verify-2fa-code', async (req, res) => {
  const { code, email } = req.body;

  if (verifyTwoFactorCode(code)) {
    const user = { email };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.cookie('token', accessToken, { httpOnly: true });
    res.json({ success: true, message: 'Код подтвержден' });
  } else {
    res.status(400).json({ success: false, message: 'Неверный код' });
  }
});

module.exports = router;