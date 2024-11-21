const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const Posting = db.define('Posting', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img_path: { type: DataTypes.STRING(255), allowNull: true },
    title: { type: DataTypes.STRING(125), allowNull: false },
    desc: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    count_like: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { freezeTableName: true });

User.hasMany(Posting, { foreignKey: 'userId' });
Posting.belongsTo(User, { foreignKey: 'userId' });

module.exports = Posting;
