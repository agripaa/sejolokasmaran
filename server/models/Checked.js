const { DataTypes } = require('sequelize');
const db = require('../config/database');
const ListJournal = require('./ListJournal');
const User = require('./User');

const Checked = db.define('Checked', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    is_checked: { type: DataTypes.BOOLEAN, allowNull: false },
    list_journal_id: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

ListJournal.hasMany(Checked, { foreignKey: 'list_journal_id', onDelete: 'CASCADE' });
Checked.belongsTo(ListJournal, { foreignKey: 'list_journal_id', onDelete: 'CASCADE' });

User.hasMany(Checked, { foreignKey: 'userId' });
Checked.belongsTo(User, { foreignKey: 'userId' });

module.exports = Checked;
