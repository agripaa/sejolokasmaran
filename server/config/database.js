const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
const config = require('./config');
require('dotenv').config();



const db = new Sequelize(
    config['development']['database'], 
    config['development']['username'], 
    config['development']['password'],
    {
        dialect: config['development']['dialect'] || mysql2,
        port: config['development']['port']
    }
);

module.exports = db;