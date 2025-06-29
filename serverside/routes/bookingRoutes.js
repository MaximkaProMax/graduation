const express = require('express');
const router = express.Router();
const { BookingTypographie } = require('../models/BookingTypographie');
const { BookingStudio } = require('../models/BookingStudio');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const authenticateToken = require('../middleware/authenticateToken');

// Добавление нового бронирования типографии
router.post('/add', authenticateToken, async (req, res) => {
  try {
    // Используем user_id из тела запроса, если есть, иначе из токена
    const userId = req.body.user_id || req.user.userId;
    const { format, spreads, lamination, quantity, price, albumName } = req.body;

    // Проверяем, что все необходимые данные присутствуют
    if (!format || !spreads || !lamination || !quantity || !price || !albumName) {
      return res.status(400).json({ success: false, message: 'Все поля должны быть заполнены' });
    }

    const newBooking = await BookingTypographie.create({
      user: userId,
      status: 'В обработке',
      format,
      the_basis_of_the_spread: 'Не указано', // Значение по умолчанию
      number_of_spreads: spreads,
      lamination,
      number_of_copies: quantity,
      final_price: price,
      album_name: albumName,
      address_delivery: 'Не указано', // Можно заменить на реальное значение
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Ошибка при добавлении бронирования:', error);
    res.status(500).json({ success: false, message: 'Ошибка при добавлении бронирования' });
  }
});

// Получение всех бронирований типографии авторизованного пользователя
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Получаем ID пользователя из токена

    const bookings = await BookingTypographie.findAll({
      where: { user: userId },
    });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении бронирований' });
  }
});

// Удаление бронирования типографии
router.delete('/typography/:id', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;

    // Получаем пользователя и его роль
    const user = await User.findOne({
      where: { userId },
      include: [{ model: Role, as: 'Role', attributes: ['roleName'] }]
    });

    let whereClause = { booking_typographie_id: bookingId };
    if (!user || user.Role.roleName !== 'Admin') {
      // Только не-админ ограничен удалением своих заявок
      whereClause.user = userId;
    }

    const deleted = await BookingTypographie.destroy({
      where: whereClause,
    });

    if (deleted) {
      res.status(200).json({ success: true, message: 'Заявка успешно удалена' });
    } else {
      res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при удалении заявки на типографию:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении заявки' });
  }
});

// Получение всех заявок на типографию (для администраторов)
router.get('/typography/all', authenticateToken, async (req, res) => {
  try {
    const bookings = await BookingTypographie.findAll(); // Убираем фильтрацию по userId
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Ошибка при получении всех заявок на типографию:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении заявок' });
  }
});

// Обновление бронирования типографии
router.put('/typography/:id', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;
    // Получаем пользователя и его роль
    const user = await User.findOne({
      where: { userId },
      include: [{ model: Role, as: 'Role', attributes: ['roleId', 'roleName'] }]
    });

    const {
      status,
      format,
      the_basis_of_the_spread,
      number_of_spreads,
      lamination,
      number_of_copies,
      address_delivery,
      final_price,
      album_name,
      payment_status
    } = req.body;

    // Проверка наличия обязательных полей (можно скорректировать по вашей модели)
    if (!status || !format || !number_of_spreads || !lamination || !number_of_copies || !final_price || !album_name) {
      return res.status(400).json({ success: false, message: 'Не все обязательные поля заполнены' });
    }

    const updateFields = {
      status,
      format,
      the_basis_of_the_spread,
      number_of_spreads,
      lamination,
      number_of_copies,
      address_delivery,
      final_price,
      album_name
    };
    if (payment_status) updateFields.payment_status = payment_status;

    // Разрешить редактирование всем для Admin/Manager, иначе только свои
    let whereClause = { booking_typographie_id: bookingId };
    if (!user || (user.Role.roleId !== 16 && user.Role.roleId !== 17)) {
      whereClause.user = userId;
    }

    const [updated] = await BookingTypographie.update(
      updateFields,
      {
        where: whereClause
      }
    );

    if (updated) {
      res.status(200).json({ success: true, message: 'Заявка успешно обновлена' });
    } else {
      res.status(404).json({ success: false, message: 'Заявка не найдена или нет прав' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении заявки на типографию:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении заявки' });
  }
});

// Новый эндпоинт: получить все брони по студии и дате
router.get('/studios/booked', authenticateToken, async (req, res) => {
  try {
    const { name, date, address } = req.query;
    if (!name || !date) {
      return res.status(400).json({ success: false, message: 'Не указаны студия или дата' });
    }
    const bookings = await BookingStudio.findAll({
      where: {
        studio_name: name,
        date: date,
        ...(address ? { address } : {})
      },
      attributes: ['time']
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка при получении занятых интервалов' });
  }
});

// Добавление нового бронирования фотостудии
router.post('/studios/add', authenticateToken, async (req, res) => {
  try {
    // Используем user_id из тела запроса, если есть, иначе из токена
    const userId = req.body.user_id || req.user.userId;
    const { name, date, time, address, totalCost } = req.body;

    if (!name || !date || !time || !address || !totalCost) {
      return res.status(400).json({ success: false, message: 'Все поля должны быть заполнены' });
    }

    // Парсим диапазон времени
    const [start, end] = (time || '').split('-');
    if (!start || !end) {
      return res.status(400).json({ success: false, message: 'Некорректный формат времени' });
    }

    // Проверка на пересечение времени среди всех заявок
    const existingBookings = await BookingStudio.findAll({
      where: {
        studio_name: name,
        date: date,
        address: address
      }
    });

    const isOverlap = existingBookings.some(b => {
      const [bStart, bEnd] = (b.time || '').split('-');
      return start < bEnd && end > bStart;
    });

    if (isOverlap) {
      return res.status(409).json({ success: false, message: 'Выбранное время уже занято' });
    }

    const newBooking = await BookingStudio.create({
      studio_name: name,
      user: userId,
      status: 'В обработке',
      date,
      time, // Сохраняем диапазон, например "09:00-10:00"
      address,
      final_price: totalCost,
    });

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Ошибка при добавлении бронирования фотостудии:', error);
    res.status(500).json({ success: false, message: 'Ошибка при добавлении бронирования' });
  }
});

// Получение всех бронирований фотостудий авторизованного пользователя
router.get('/studios/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await BookingStudio.findAll({
      where: { user: userId },
    });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Ошибка при получении бронирований фотостудий:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении бронирований' });
  }
});

// Удаление бронирования фотостудии
router.delete('/studios/:id', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;

    // Получаем пользователя и его роль
    const user = await User.findOne({
      where: { userId },
      include: [{ model: Role, as: 'Role', attributes: ['roleName'] }]
    });

    let whereClause = { booking_studio_id: bookingId };
    if (!user || user.Role.roleName !== 'Admin') {
      // Только не-админ ограничен удалением своих заявок
      whereClause.user = userId;
    }

    const deleted = await BookingStudio.destroy({
      where: whereClause,
    });

    if (deleted) {
      res.status(200).json({ success: true, message: 'Заявка успешно удалена' });
    } else {
      res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при удалении заявки на фотостудию:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении заявки' });
  }
});

// Получение всех заявок на фотостудии (для администраторов)
router.get('/studios/all', authenticateToken, async (req, res) => {
  try {
    const bookings = await BookingStudio.findAll(); // Убираем фильтрацию по userId
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Ошибка при получении всех заявок на фотостудии:', error);
    res.status(500).json({ success: false, message: 'Ошибка при получении заявок' });
  }
});

// Обновление бронирования фотостудии
router.put('/studios/:id', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId;
    // Получаем пользователя и его роль
    const user = await User.findOne({
      where: { userId },
      include: [{ model: Role, as: 'Role', attributes: ['roleId', 'roleName'] }]
    });

    const {
      studio_name,
      status,
      date,
      time,
      end_time,
      address,
      final_price,
      payment_status
    } = req.body;

    // Логируем входящие данные для отладки
    console.log('PUT /studios/:id', {
      studio_name, status, date, time, end_time, address, final_price, payment_status
    });

    // Проверка наличия обязательных полей (делаем status и end_time не обязательными)
    if (!studio_name || !date || !time || !address || !final_price) {
      return res.status(400).json({ success: false, message: 'Не все обязательные поля заполнены (studio_name, date, time, address, final_price)' });
    }

    const updateFields = {
      studio_name,
      status: status || 'В обработке',
      date,
      time,
      end_time: end_time || null,
      address,
      final_price
    };
    if (payment_status) updateFields.payment_status = payment_status;

    // Разрешить редактирование всем для Admin/Manager, иначе только свои
    let whereClause = { booking_studio_id: bookingId };
    if (!user || (user.Role.roleId !== 16 && user.Role.roleId !== 17)) {
      whereClause.user = userId;
    }

    const [updated] = await BookingStudio.update(
      updateFields,
      {
        where: whereClause
      }
    );

    if (updated) {
      res.status(200).json({ success: true, message: 'Заявка успешно обновлена' });
    } else {
      res.status(404).json({ success: false, message: 'Заявка не найдена или нет прав' });
    }
  } catch (error) {
    console.error('Ошибка при обновлении заявки на фотостудию:', error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении заявки' });
  }
});

module.exports = router;