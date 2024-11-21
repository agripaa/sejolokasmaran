const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ClassYoga = db.define('ClassYoga', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url_link: { type: DataTypes.STRING(255), allowNull: false },
}, { freezeTableName: true });

module.exports = ClassYoga;
