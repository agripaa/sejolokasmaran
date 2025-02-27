const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Trimester = require('./Trimester');
const CategoryJournal = require('./CategoryJournal');

const PregnancyJournal = db.define('PregnancyJournal', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    category_jurnal: { type: DataTypes.STRING(125), allowNull: false },
    trimester_id: { type: DataTypes.INTEGER, allowNull: false },
    cat_journal_id: {type: DataTypes.INTEGER, allowNull: true},
    notes: { type: DataTypes.TEXT, allowNull: true },
}, { freezeTableName: true });

Trimester.hasMany(PregnancyJournal, { foreignKey: 'trimester_id' });
PregnancyJournal.belongsTo(Trimester, { foreignKey: 'trimester_id' });

CategoryJournal.hasMany(PregnancyJournal, {foreignKey: "cat_journal_id", onDelete: "NO ACTION"});
PregnancyJournal.belongsTo(CategoryJournal, { foreignKey: "cat_journal_id", onDelete: "NO ACTION"})

module.exports = PregnancyJournal;
