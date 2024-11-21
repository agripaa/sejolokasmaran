const { DataTypes } = require('sequelize');
const db = require('../config/database');
const ListClass = require('./ListClass');

const DetailClass = db.define('DetailClass', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    list_class_id: { type: DataTypes.INTEGER, allowNull: false },
    desc: { type: DataTypes.TEXT, allowNull: false },
}, { freezeTableName: true });

ListClass.hasMany(DetailClass, { foreignKey: 'list_class_id' });
DetailClass.belongsTo(ListClass, { foreignKey: 'list_class_id' });

module.exports = DetailClass;
