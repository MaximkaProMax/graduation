const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('photoproject', 'Max', 'Max', {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: console.log, // Логирование всех запросов в консоль
});

sequelize.authenticate()
  .then(() => {
    console.log('Подключение к базе данных установлено успешно.');
  })
  .catch((err) => {
    console.error('Ошибка подключения к базе данных:', err);
  });

module.exports = sequelize;