'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roster_jugadores', [
      {
        id_roster: 1,
        id_jugador: 1,
        rol_en_roster: 'Titular',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_roster: 1,
        id_jugador: 2,
        rol_en_roster: 'Suplente',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    //await queryInterface.bulkDelete('roster_jugadores', null, {});
  }
};