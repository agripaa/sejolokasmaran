const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Author = db.define('Author', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(125), allowNull: false },
    position: { type: DataTypes.STRING(125), allowNull: false },
    desc: { type: DataTypes.TEXT, allowNull: true },
}, { freezeTableName: true });

module.exports = Author;
