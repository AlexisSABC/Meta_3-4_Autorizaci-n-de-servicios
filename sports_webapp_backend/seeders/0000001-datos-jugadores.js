'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('jugadores', [
      {
        nickname: 'Faker',
        nombre_real: 'Lee Sang-hyeok',
        pais: 'Corea del Sur',
        rol: 'Mid',
        estado: 'Activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nickname: 'Impact',
        nombre_real: 'Jung Eon-yeong',
        pais: 'Corea del Sur',
        rol: 'Top',
        estado: 'Activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nickname: 'Jankos',
        nombre_real: 'Marcin Jankowski',
        pais: 'Polonia',
        rol: 'Jungle',
        estado: 'Inactivo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nickname: 'Ruler',
        nombre_real: 'Park Jae-hyuk',
        pais: 'Corea del Sur',
        rol: 'ADC',
        estado: 'Activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nickname: 'CoreJJ',
        nombre_real: 'Jo Yong-in',
        pais: 'Corea del Sur',
        rol: 'Support',
        estado: 'Activo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    //await queryInterface.bulkDelete('jugadores', null, {});
  }
};