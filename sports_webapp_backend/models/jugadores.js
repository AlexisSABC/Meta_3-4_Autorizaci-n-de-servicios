'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jugadores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jugadores.init({
    nickname: DataTypes.STRING,
    nombre_real: DataTypes.STRING,
    pais: DataTypes.STRING,
    rol: DataTypes.ENUM('Top', 'Jungle', 'Mid', 'ADC', 'Support'),
    estado: DataTypes.ENUM('Activo', 'Inactivo')
  }, {
    sequelize,
    modelName: 'jugadores',
  });
  return jugadores;
};