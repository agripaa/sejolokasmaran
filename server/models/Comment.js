const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Posting = require('./Posting');
const User = require('./User');

const Comment = db.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    posting_id: { type: DataTypes.INTEGER, allowNull: false },
    comment_id: { type: DataTypes.INTEGER, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Posting.hasMany(Comment, { foreignKey: 'posting_id' });
Comment.belongsTo(Posting, { foreignKey: 'posting_id' });

Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'comment_id' });
Comment.belongsTo(Comment, { as: 'ParentComment', foreignKey: 'comment_id' });

module.exports = Comment;
