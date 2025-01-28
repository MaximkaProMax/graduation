// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('photoproject', 'Max', 'Max', {
  host: '127.0.0.1',
  dialect: 'postgres',
});

module.exports = sequelize;