const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Trimester = db.define('Trimester', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cat_trimester: { type: DataTypes.INTEGER, allowNull: false },
    desc: { type: DataTypes.TEXT, allowNull: false },
    postpartum_desc: { type: DataTypes.TEXT, allowNull: true},
    baby_desc: {type: DataTypes.TEXT, allowNull: true}
}, { freezeTableName: true });

module.exports = Trimester;
