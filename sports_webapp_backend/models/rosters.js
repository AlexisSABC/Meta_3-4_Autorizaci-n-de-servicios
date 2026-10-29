'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rosters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rosters.init({
    nombre: DataTypes.STRING,
    juego: DataTypes.STRING,
    tipo: DataTypes.ENUM('Principal', 'Academy'),
    temporada: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'rosters',
  });
  return rosters;
};