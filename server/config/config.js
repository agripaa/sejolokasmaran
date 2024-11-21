require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'mamank546',
    database: process.env.DB_NAME || 'sejolikasmaran',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 8889,
    dialect: 'mysql',
  },
};