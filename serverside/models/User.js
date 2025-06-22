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
      model: 'Roles', // Указывает на таблицу Roles
      key: 'roleId',  // Указывает на поле roleId в таблице Roles
    },
    defaultValue: 2, // Значение по умолчанию
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
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  review: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  resetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
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
User.belongsTo(Role, { foreignKey: 'roleId', as: 'Role', onDelete: 'RESTRICT' });

module.exports = User;