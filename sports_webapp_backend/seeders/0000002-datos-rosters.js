'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('rosters', [
      {
        nombre: 'TL Principal',
        juego: 'League of leyends',
        tipo: 'Principal',
        temporada: '2026',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'TL Academy',
        juego: 'League of leyends',
        tipo: 'Academy',
        temporada: '2025',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    //await queryInterface.bulkDelete('rosters', null, {});
  }
};