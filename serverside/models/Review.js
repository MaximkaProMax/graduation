const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Импорт модели User

const Review = sequelize.define(
  'Review',
  {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
      },
    },
    photostudio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    printing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.ENUM('плохо', 'нормально', 'хорошо', 'очень хорошо', 'отлично'),
      allowNull: true, // Сделано необязательным
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
    tableName: 'REVIEWS',
    timestamps: false,
  }
);

// Настройка ассоциации
Review.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

module.exports = Review;