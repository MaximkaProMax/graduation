const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingByPhone = sequelize.define(
  'BookingByPhone',
  {
    booking_by_phone_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photostudio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    printing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Новая',
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
    tableName: 'booking_by_phone',
    timestamps: false,
  }
);

module.exports = { BookingByPhone };
