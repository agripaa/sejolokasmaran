const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Posting = require('./Posting');
const User = require('./User');

const Likes = db.define('Likes', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    posting_id: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

User.hasMany(Likes, { foreignKey: 'userId' });
Likes.belongsTo(User, { foreignKey: 'userId' });

Posting.hasMany(Likes, { foreignKey: 'posting_id' });
Likes.belongsTo(Posting, { foreignKey: 'posting_id' });

module.exports = Likes;
