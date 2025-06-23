const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  roleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Roles', // Указываем имя таблицы
  timestamps: false, // Отключаем автоматическое добавление полей createdAt и updatedAt
});

module.exports = Role;