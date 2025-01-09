const { DataTypes } = require('sequelize');
const db = require('../config/database');

const EmailLog = db.define('EmailLog', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    visit_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    send_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'email_logs',
    timestamps: true,
});

module.exports = EmailLog;
