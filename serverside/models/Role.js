const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  roleId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Roles',
  timestamps: true,
});

module.exports = Role;