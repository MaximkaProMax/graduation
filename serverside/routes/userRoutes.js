const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
const { generateTwoFactorCode, verifyTwoFactorCode } = require('../services/twoFactorAuth');
const User = require('../models/User');
const Role = require('../models/Role'); // Импорт модели Role
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');
const { Op } = require('sequelize'); // Импортируем операторы Sequelize
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

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

// Маршрут для входа пользователя
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('[LOGIN] Запрос на логин:', { email }); // Логируем email

  try {
    console.log('[LOGIN] Попытка найти пользователя в базе данных...');
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('[LOGIN] Пользователь не найден:', email);
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    console.log('[LOGIN] Пользователь найден, проверка пароля...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('[LOGIN] Неверный пароль для пользователя:', email);
      return res.status(400).json({ success: false, message: 'Неверный пароль' });
    }

    // Оптимизация: если есть активный resetToken, сбрасываем его
    if (user.resetToken || user.resetTokenExpires) {
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();
      console.log('[LOGIN] Сброшен resetToken/resetTokenExpires при успешном входе');
    }

    const code = generateTwoFactorCode();
    console.log('[LOGIN] Пароль верный, отправка 2FA кода...');

    try {
      console.log('[LOGIN] Вызов sendEmail...');
      await sendEmail(email, 'Ваш код двухфакторной аутентификации', `Ваш код для входа: ${code}`);
      console.log('[LOGIN] sendEmail завершился без ошибок');
    } catch (emailError) {
      console.error('[LOGIN] Ошибка при отправке email:', emailError);
      if (emailError && emailError.stack) {
        console.error('[LOGIN] Stack trace (email):', emailError.stack);
      }
      return res.status(500).json({ success: false, message: 'Ошибка при отправке email', error: emailError.message });
    }

    console.log('[LOGIN] Код 2FA отправлен, логин завершён успешно.');
    res.json({ success: true, twoFactorRequired: true });
  } catch (error) {
    console.error('[LOGIN] Ошибка при входе:', error);
    if (error instanceof Error && error.stack) {
      console.error('[LOGIN] Stack trace:', error.stack);
    }
    res.status(500).json({ success: false, message: 'Ошибка сервера', error: error.message });
  }
});

// Маршрут для проверки кода двухфакторной аутентификации
router.post('/verify-2fa-code', async (req, res) => {
  const { code, email } = req.body;

  if (verifyTwoFactorCode(code)) {
    const user = await User.findOne({ where: { email } });
    const accessToken = jwt.sign(
      { userId: user.userId, email: user.email, roleId: user.roleId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', accessToken, { httpOnly: true });
    res.json({ success: true, message: 'Код подтвержден' });
  } else {
    res.status(400).json({ success: false, message: 'Неверный код' });
  }
});

// Получить данные авторизованного пользователя
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.user.email },
      include: [{ model: Role, as: 'Role', attributes: ['roleName'] }],
    });
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
  const { name, login, telephone, email, currentPassword, newPassword, roleId } = req.body;

  try {
    // Проверяем, существует ли roleId в таблице Roles
    const roleExists = await Role.findByPk(roleId);
    if (!roleExists) {
      return res.status(400).json({ message: 'Указанная роль не существует' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Текущий пароль неверен' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    user.name = name;
    user.login = login;
    user.telephone = telephone;
    user.email = email;
    user.roleId = roleId; // Обновляем роль

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

router.get('/user/reviews', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { userId: req.user.userId },
      include: [
        {
          model: Review,
          as: 'Reviews',
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    res.json(user.Reviews);
  } catch (error) {
    console.error('Ошибка при получении отзывов пользователя:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Получить профиль пользователя для блока контактных данных (Booking)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Получаем пользователя по userId из токена
    const user = await User.findOne({ where: { userId: req.user.userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
    // Формируем объект профиля для фронта
    res.json({
      success: true,
      user: {
        fullName: user.name || '',
        email: user.email || '',
        phone: user.telephone || '',
        address: user.address || '', // если поле address есть в модели, иначе ''
      }
    });
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Маршрут для отправки письма со сбросом пароля
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error('Пользователь с указанным email не найден:', email);
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 час
    await user.save();

    console.log('Ссылка для сброса пароля:', resetLink);

    await sendPasswordResetEmail(email, resetLink);
    res.json({ success: true, message: 'Ссылка для сброса пароля отправлена на вашу почту' });
  } catch (error) {
    console.error('Ошибка при отправке письма для сброса пароля:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Маршрут для сброса пароля
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Токен недействителен или истёк' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.json({ success: true, message: 'Пароль успешно сброшен' });
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

// Проверка роли пользователя
router.get('/check-role', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { userId: req.user.userId },
      include: [{ model: Role, as: 'Role', attributes: ['roleName'] }],
    });

    if (!user) {
      console.log('Пользователь не найден'); // Отладочное сообщение
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    console.log('Роль пользователя:', user.Role.roleName); // Отладочное сообщение
    res.json({ success: true, role: user.Role.roleName });
  } catch (error) {
    console.error('Ошибка при проверке роли пользователя:', error); // Отладочное сообщение
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

module.exports = router;