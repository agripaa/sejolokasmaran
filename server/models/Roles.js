const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Roles = db.define('Roles', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_name: { type: DataTypes.STRING(50), allowNull: false },
}, { freezeTableName: true });

module.exports = Roles;
