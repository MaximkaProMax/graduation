const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Photostudios = require('./Photostudios');
const Printing = require('./Printing'); // Импорт модели Printing

const Favourites = sequelize.define('favourites', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'userId'
    }
  },
  studio_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Изменено с false на true
    references: {
      model: Photostudios,
      key: 'id'
    }
  },
  printing_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'printing',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'favourites',
  timestamps: false
});

// Настройка ассоциаций
Favourites.belongsTo(User, { foreignKey: 'user_id' });
Favourites.belongsTo(Photostudios, { foreignKey: 'studio_id' });
Favourites.belongsTo(Printing, { foreignKey: 'printing_id' });

module.exports = Favourites;