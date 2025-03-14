const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Printing = sequelize.define('printing', {
  main_card_photo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  main_album_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  main_card_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  name_on_page: {
    type: DataTypes.STRING
  },
  photos_on_page: {
    type: DataTypes.ARRAY(DataTypes.TEXT)
  },
  product_description: {
    type: DataTypes.TEXT
  },
  additional_information: {
    type: DataTypes.TEXT
  },
  format: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  basis_for_spread: {
    type: DataTypes.STRING
  },
  price_of_spread: {
    type: DataTypes.DECIMAL
  },
  lamination: {
    type: DataTypes.STRING
  },
  copy_price: {
    type: DataTypes.DECIMAL
  },
  date_of_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  date_of_editing: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  freezeTableName: true, // Использовать точное имя таблицы
  timestamps: false // Отключить автоматическое добавление столбцов createdAt и updatedAt
});

module.exports = Printing;