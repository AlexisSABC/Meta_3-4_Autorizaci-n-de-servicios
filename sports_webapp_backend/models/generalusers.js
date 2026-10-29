'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class generalUsers extends Model {
    static associate(models) {
      // Relaciones futuras
    }
  }
  generalUsers.init({
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: DataTypes.STRING,
    ultimoAcceso: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'generalUsers',
  });
  return generalUsers;
};