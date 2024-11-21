const { DataTypes } = require('sequelize');
const db = require('../config/database');
const DetailClass = require('./DetailClass');

const Subject = db.define('Subject', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sub_lear_path: { type: DataTypes.STRING(255), allowNull: false },
    detail_class_id: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

DetailClass.hasMany(Subject, { foreignKey: 'detail_class_id' });
Subject.belongsTo(DetailClass, { foreignKey: 'detail_class_id' });

module.exports = Subject;
