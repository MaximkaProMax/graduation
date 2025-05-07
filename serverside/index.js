require('dotenv').config(); // Подключаем dotenv для использования .env файла

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); // Импортируем express-session для сессий
const cookieParser = require('cookie-parser'); // Импортируем cookie-parser для работы с cookies
const jwt = require('jsonwebtoken'); // Импортируем jsonwebtoken для работы с JWT
const sequelize = require('./config/database');
const User = require('./models/User');
const Role = require('./models/Role'); // Импортируем модель Role
const Printing = require('./models/Printing'); // Импортируем модель Printing
const userRoutes = require('./routes/userRoutes'); // Импорт маршрутов пользователей
const roleRoutes = require('./routes/roleRoutes'); // Импортируем маршруты ролей
const photostudiosRoutes = require('./routes/photostudiosRoutes'); // Импортируем маршруты фотостудий
const printingRoutes = require('./routes/printingRoutes'); // Импортируем маршруты печати
const favouritesRoutes = require('./routes/favouritesRoutes'); // Импортируем маршруты для избранного
const bookingRoutes = require('./routes/bookingRoutes'); // Импортируем маршруты для бронирования
const requestsRoutes = require('./routes/requestsRoutes'); // Импорт нового маршрута
const reviewRoutes = require('./routes/reviewRoutes'); // Импорт маршрутов для отзывов

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Указываем адрес фронтенда для разрешения CORS
  credentials: true // Разрешаем отправку cookies
}));
app.use(bodyParser.json()); // Для обработки JSON тела запросов
app.use(cookieParser()); // Для работы с cookies

// Настройка сессии
app.use(session({
  secret: process.env.SESSION_SECRET || 'temporary_secret_key', // Используем секретный ключ из .env файла или временный ключ
  resave: false,
  saveUninitialized: false, // Изменено на false для предотвращения создания пустых сессий
  cookie: { secure: false } // Убедитесь, что secure: false для локальной разработки
}));

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

// Подключение маршрутов для пользователей и ролей
app.use('/api/users', userRoutes); // Подключение маршрутов пользователей
// Добавьте этот маршрут для совместимости с Booking.jsx
app.use('/api/user', userRoutes);
app.use('/api/roles', roleRoutes); // Подключаем маршруты ролей
app.use('/api/photostudios', photostudiosRoutes); // Подключаем маршруты фотостудий
app.use('/api/printing', printingRoutes); // Подключаем маршруты печати
app.use('/api/favourites', favouritesRoutes); // Подключаем маршруты для избранного
app.use('/api/bookings', bookingRoutes); // Подключаем маршруты для бронирования
app.use('/api/booking-by-phone', require('./routes/bookingByPhoneRoutes')); // Убедимся, что маршрут подключен
app.use('/api/requests', requestsRoutes); // Подключение маршрута для запросов
app.use('/api/reviews', reviewRoutes); // Подключение маршрутов для отзывов

// Маршрут по умолчанию авторизации через cookies
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// Маршрут для проверки авторизации через cookies
app.get('/api/auth/check', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({ isAuthenticated: false });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ isAuthenticated: false });
    }
    res.json({ isAuthenticated: true });
  });
});

// Пример маршрута для создания пользователя (остается на всякий случай)
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Ошибка создания пользователя:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Пример маршрута для получения всех фотостудий
app.get('/api/photostudios', async (req, res) => {
  try {
    const studios = await sequelize.query('SELECT * FROM Photostudios', {
      type: sequelize.QueryTypes.SELECT
    });
    console.log('Данные из базы данных:', studios); // Лог данных из базы данных
    res.json(studios);
  } catch (error) {
    console.error('Ошибка при получении данных из базы данных:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Маршрут для выхода
app.post('/api/users/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// Запуск сервера после синхронизации с базой данных
sequelize.sync()
  .then(() => {
    app.listen(3001, () => {
      console.log('Сервер запущен на порту 3001');
    });
  })
  .catch(err => console.error('Ошибка синхронизации с базой данных:', err));