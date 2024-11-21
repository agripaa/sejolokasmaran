const { DataTypes } = require('sequelize');
const db = require('../config/database');
const LearnList = require('./LearnList');

const ListClass = db.define('ListClass', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img_path: { type: DataTypes.STRING(255), allowNull: false },
    title: { type: DataTypes.STRING(125), allowNull: false },
    learn_list_id: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

LearnList.hasMany(ListClass, { foreignKey: 'learn_list_id' });
ListClass.belongsTo(LearnList, { foreignKey: 'learn_list_id' });

module.exports = ListClass;
