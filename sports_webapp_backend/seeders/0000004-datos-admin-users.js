'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('adminUsers', [
      {
        name: 'Alexis SA',
        email: 'alexis@uabc.edu.mx',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mayorga EA',
        email: 'mayo@uabc.edu.mx',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Prof Olguin',
        email: 'olguin@uabc.edu.mx',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    //await queryInterface.bulkDelete('adminUsers', null, {});
  }
};