const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Photostudios = sequelize.define('photostudios', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    studio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    opening_hours: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact_information: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    booking: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    photo: {
        type: DataTypes.STRING
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
    tableName: 'photostudios',
    timestamps: false
});

module.exports = Photostudios;