const { DataTypes } = require('sequelize');
const db = require('../config/database');
const News = require('./News');

const NewsContent = db.define('NewsContent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    news_id: { type: DataTypes.INTEGER, allowNull: false },
    paragraph: { type: DataTypes.TEXT, allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

News.hasMany(NewsContent, { foreignKey: 'news_id', onDelete: 'CASCADE' });
NewsContent.belongsTo(News, { foreignKey: 'news_id' });

module.exports = NewsContent;
