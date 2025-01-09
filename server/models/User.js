const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Roles = require('./Roles');
const RelationType = require('./RelationType');

const User = db.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    username: { type: DataTypes.STRING(125), allowNull: false },
    husband_name: { type: DataTypes.STRING(125), allowNull: true },
    wife_name: { type: DataTypes.STRING(125), allowNull: true },
    email: { type: DataTypes.STRING(125), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(25), allowNull: true },
    address: { type: DataTypes.STRING(255), allowNull: true },
    date_birth: { type: DataTypes.DATE, allowNull: true },
    born_date: {type: DataTypes.DATE, allowNull: true},
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    relation_types: { type: DataTypes.INTEGER, allowNull: false },
}, { freezeTableName: true });

Roles.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Roles, { foreignKey: 'role_id' });

RelationType.hasMany(User, { foreignKey: 'relation_types' });
User.belongsTo(RelationType, { foreignKey: 'relation_types' });

module.exports = User;
