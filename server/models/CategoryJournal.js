const { DataTypes } = require('sequelize');
const db = require('../config/database');

const CategoryJournal = db.define('CategoryJournal', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cat_name: { type: DataTypes.STRING(50), allowNull: false },
}, { freezeTableName: true });

module.exports = CategoryJournal;
