const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const reviewRoute = require('./routes/reviewRoutes');
const userRoute = require('./routes/userRoutes'); 

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
    console.error('Ошибка создания пользователя:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Подключение маршрутов для пользователей и отзывов
app.use('/api/users', userRoute);
app.use('/api/reviews', reviewRoute);

// Маршрут для получения информации о пользователях
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Ошибка получения пользователей:', error.message);
    res.status(500).json({ error: 'Ошибка получения пользователей' });
  }
});

// Маршрут для обновления информации о пользователе
app.put('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await User.update(req.body, { where: { userId } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка обновления пользователя' });
  }
});

// Маршрут для удаления пользователя
app.delete('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await User.destroy({ where: { userId } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error.message);
    res.status(500).json({ error: 'Ошибка удаления пользователя' });
  }
});

sequelize.sync()
  .then(() => {
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch(err => console.error('Database sync error:', err));