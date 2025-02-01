const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./Role'); // Импортируем модель Role для создания связей

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'roleId',
    },
    defaultValue: 2 // Устанавливаем значение по умолчанию для roleId, например, для роли 'User'
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: 'missing@address.com',
  },
  telephone: {
    type: DataTypes.STRING,
  },
  review: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Users',
  timestamps: true,
});

// Устанавливаем связь между User и Role
User.belongsTo(Role, { foreignKey: 'roleId', onDelete: 'RESTRICT' });

module.exports = User;