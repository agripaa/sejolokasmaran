const { DataTypes } = require('sequelize');
const db = require('../config/database');

const RelationType = db.define('RelationType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name_relation: { type: DataTypes.STRING(25), allowNull: false },
}, { freezeTableName: true });

module.exports = RelationType;
