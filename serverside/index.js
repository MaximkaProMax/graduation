require('dotenv').config(); // Подключаем dotenv для использования .env файла

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session'); // Импортируем express-session для сессий
const sequelize = require('./config/database');
const User = require('./models/User');
const Role = require('./models/Role'); // Импортируем модель Role
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes'); // Импортируем маршруты ролей

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Указываем адрес фронтенда для разрешения CORS
  credentials: true // Разрешаем отправку cookies
}));
app.use(bodyParser.json()); // Для обработки JSON тела запросов

// Настройка сессии
app.use(session({
  secret: process.env.SESSION_SECRET || 'temporary_secret_key', // Используем секретный ключ из .env файла или временный ключ
  resave: false,
  saveUninitialized: false, // Изменено на false для предотвращения создания пустых сессий
  cookie: { secure: false } // Убедитесь, что secure: false для локальной разработки
}));

// Подключение маршрутов для пользователей и ролей
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes); // Подключаем маршруты ролей

// Маршрут по умолчанию
app.get('/', (req, res) => {
  res.send('Hello from PhotoProject API!');
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

// Запуск сервера после синхронизации с базой данных
sequelize.sync()
  .then(() => {
    app.listen(3001, () => {
      console.log('Сервер запущен на порту 3001');
    });
  })
  .catch(err => console.error('Ошибка синхронизации с базой данных:', err));