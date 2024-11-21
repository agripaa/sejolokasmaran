const { DataTypes } = require('sequelize');
const db = require('../config/database');

const LearnCategory = db.define('LearnCategory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category_name: { type: DataTypes.STRING(125), allowNull: false },
}, { freezeTableName: true });

module.exports = LearnCategory;
