const express = require('express');
const router = express.Router();
const { BookingTypographie } = require('../models/BookingTypographie');
const { BookingStudio } = require('../models/BookingStudio');
const jwt = require('jsonwebtoken');

// Middleware для проверки JWT токенов
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Получаем токен из cookies
  if (!token) return res.status(401).json({ success: false, message: 'Не авторизован' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Доступ запрещён' });
    req.user = user; // Добавляем данные пользователя в запрос
    next();
  });
};

// Добавление нового бронирования типографии
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Получаем ID пользователя из токена
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

    const deleted = await BookingTypographie.destroy({
      where: { booking_typographie_id: bookingId, user: req.user.userId },
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
    const {
      status,
      format,
      the_basis_of_the_spread,
      number_of_spreads,
      lamination,
      number_of_copies,
      address_delivery,
      final_price,
      album_name
    } = req.body;

    // Проверка наличия обязательных полей (можно скорректировать по вашей модели)
    if (!status || !format || !number_of_spreads || !lamination || !number_of_copies || !final_price || !album_name) {
      return res.status(400).json({ success: false, message: 'Не все обязательные поля заполнены' });
    }

    const [updated] = await BookingTypographie.update(
      {
        status,
        format,
        the_basis_of_the_spread,
        number_of_spreads,
        lamination,
        number_of_copies,
        address_delivery,
        final_price,
        album_name
      },
      {
        where: { booking_typographie_id: bookingId, user: userId }
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

// Добавление нового бронирования фотостудии
router.post('/studios/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Получаем ID пользователя из токена
    const { name, date, startTime, endTime, address, totalCost } = req.body;

    if (!name || !date || !startTime || !endTime || !address || !totalCost) {
      return res.status(400).json({ success: false, message: 'Все поля должны быть заполнены' });
    }

    const newBooking = await BookingStudio.create({
      studio_name: name,
      user: userId,
      status: 'В обработке',
      date,
      time: startTime,
      end_time: endTime, // сохраняем endTime, если есть такое поле в модели
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

    const deleted = await BookingStudio.destroy({
      where: { booking_studio_id: bookingId, user: req.user.userId },
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
    const {
      studio_name,
      status,
      date,
      time,
      end_time,
      address,
      final_price
    } = req.body;

    // Логируем входящие данные для отладки
    console.log('PUT /studios/:id', {
      studio_name, status, date, time, end_time, address, final_price
    });

    // Проверка наличия обязательных полей (делаем status и end_time не обязательными)
    if (!studio_name || !date || !time || !address || !final_price) {
      return res.status(400).json({ success: false, message: 'Не все обязательные поля заполнены (studio_name, date, time, address, final_price)' });
    }

    const [updated] = await BookingStudio.update(
      {
        studio_name,
        status: status || 'В обработке',
        date,
        time,
        end_time: end_time || null,
        address,
        final_price
      },
      {
        where: { booking_studio_id: bookingId, user: userId }
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