const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const OtpCode = db.define('OtpCode', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING(6), allowNull: false },
    expired: { type: DataTypes.DATE, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

User.hasMany(OtpCode, { foreignKey: 'userId', as: 'otps' });
OtpCode.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = OtpCode;
