const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Author = require('./Author');

const News = db.define('News', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img_news: { type: DataTypes.STRING(255), allowNull: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    sub_title: { type: DataTypes.STRING(255), allowNull: true },
    category: { type: DataTypes.STRING(255), allowNull: false },
    release: { type: DataTypes.DATE, allowNull: false },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

Author.hasMany(News, { foreignKey: 'author_id', onDelete: 'CASCADE' });
News.belongsTo(Author, { foreignKey: 'author_id' });

module.exports = News;
