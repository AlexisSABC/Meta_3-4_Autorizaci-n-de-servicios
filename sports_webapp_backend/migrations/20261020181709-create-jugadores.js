'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jugadores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.STRING
      },
      nombre_real: {
        type: Sequelize.STRING
      },
      pais: {
        type: Sequelize.STRING
      },
      rol: {
        type: Sequelize.ENUM('Top', 'Jungle', 'Mid', 'ADC', 'Support')
      },
      estado: {
        type: Sequelize.ENUM('Activo', 'Inactivo')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jugadores');
  }
};