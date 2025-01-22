const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const reviewRoute = require('./routes/reviewRoutes');  // Импорт маршрутов для отзывов

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Маршруты
app.get('/', (req, res) => {
  res.send('Hello from PhotoProject API!');
});

// Пример маршрута для создания пользователя
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Подключение маршрутов для отзывов
app.use('/', reviewRoute);  // Подключение маршрутов для отзывов

sequelize.sync()
  .then(() => {
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch(err => console.error('Database sync error:', err));