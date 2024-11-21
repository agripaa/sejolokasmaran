const { DataTypes } = require('sequelize');
const db = require('../config/database');
const PregnancyJournal = require('./PregnancyJournal');

const ListJournal = db.define('ListJournal', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    journal: { type: DataTypes.STRING, allowNull: false },
    is_required: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false},
    pregnancy_journal_id: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

PregnancyJournal.hasMany(ListJournal, { foreignKey: 'pregnancy_journal_id', onDelete: 'CASCADE' });
ListJournal.belongsTo(PregnancyJournal, { foreignKey: 'pregnancy_journal_id', onDelete: 'CASCADE' });


module.exports = ListJournal;
