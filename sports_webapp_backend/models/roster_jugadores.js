'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roster_jugadores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  roster_jugadores.init({
    id_roster: DataTypes.INTEGER,
    id_jugador: DataTypes.INTEGER,
    rol_en_roster: DataTypes.ENUM('Titular', 'Suplente')
  }, {
    sequelize,
    modelName: 'roster_jugadores',
  });
  return roster_jugadores;
};