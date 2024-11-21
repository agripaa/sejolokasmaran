const { DataTypes } = require('sequelize');
const db = require('../config/database');
const LearnCategory = require('./LearnCategory');

const LearnList = db.define('LearnList', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(125), allowNull: false },
    img_path: { type: DataTypes.STRING(255), allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

LearnCategory.hasMany(LearnList, { foreignKey: 'category_id' });
LearnList.belongsTo(LearnCategory, { foreignKey: 'category_id' });

module.exports = LearnList;
