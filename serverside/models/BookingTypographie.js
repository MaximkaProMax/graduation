const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingTypographie = sequelize.define(
  'BookingTypographie',
  {
    booking_typographie_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    format: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    the_basis_of_the_spread: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number_of_spreads: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lamination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number_of_copies: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address_delivery: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    final_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    album_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'booking_typographie', // Указываем имя таблицы
    timestamps: false, // Отключаем автоматическое добавление полей createdAt и updatedAt
  }
);

module.exports = { BookingTypographie };