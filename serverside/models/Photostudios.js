const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Photostudios = sequelize.define('photostudios', {
    id: { // Изменено на нижний регистр
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    studio: { // Изменено на нижний регистр
        type: DataTypes.STRING,
        allowNull: false
    },
    address: { // Изменено на нижний регистр
        type: DataTypes.STRING,
        allowNull: false
    },
    opening_hours: { // Изменено на нижний регистр
        type: DataTypes.STRING,
        allowNull: false
    },
    price: { // Изменено на нижний регистр
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_information: { // Изменено на нижний регистр
        type: DataTypes.STRING
    },
    description: { // Изменено на нижний регистр
        type: DataTypes.TEXT
    },
    booking: { // Изменено на нижний регистр
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    photo: { // Изменено на нижний регистр
        type: DataTypes.STRING
    },
    date_of_creation: { // Изменено на нижний регистр
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    date_of_editing: { // Изменено на нижний регистр
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'photostudios', // Указание имени таблицы в нижнем регистре
    timestamps: false
});

module.exports = Photostudios;