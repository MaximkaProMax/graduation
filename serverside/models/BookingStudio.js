const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingStudio = sequelize.define(
  'BookingStudio',
  {
    booking_studio_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studio_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'В обработке',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING, // Изменено с DataTypes.TIME на DataTypes.STRING
      allowNull: false,
      // Теперь здесь будет храниться диапазон, например "09:00-10:00"
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    final_price: {
      type: DataTypes.DECIMAL(10, 2),
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
    // Поле end_time было удалено
  },
  {
    tableName: 'booking_photostudios',
    timestamps: false,
  }
);

module.exports = { BookingStudio };