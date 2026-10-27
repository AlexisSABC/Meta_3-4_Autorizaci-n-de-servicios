'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('generalUsers', [
      {
        name: 'randomUserI',
        email: 'ksksdjdj@uabc.edu.mx',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'randomUserZ',
        email: '99q7djjjd@uabc.edu.mx',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'randomUserIXLSX',
        email: 'lkajiiiiii@uabc.edu.mx',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    //await queryInterface.bulkDelete('generalUsers', null, {});
  }
};