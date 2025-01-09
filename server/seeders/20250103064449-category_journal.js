'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('CategoryJournal', [
      {
        cat_name: "BAYI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cat_name: "KEHAMILAN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cat_name: "PERAWATAN",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CategoryJournal', null, {});
  },
};
