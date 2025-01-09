'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await queryInterface.bulkInsert('User', [
      {
        username: "admin",
        email: 'admin@test.com',
        password: hashedPassword,
        husband_name: null,
        wife_name: null,
        phone: "08787248888",
        address: "Jl. takotoke",
        date_birth: "2024-05-24",
        role_id: 2,
        relation_types: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
  },
};
