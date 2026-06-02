const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Patient = sequelize.define("Patient", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  age: {
    type: DataTypes.INTEGER,
  },

  gender: {
    type: DataTypes.STRING,
  },

  phone: {
    type: DataTypes.STRING,
  },

  medicalHistory: {
    type: DataTypes.TEXT,
  },
});

module.exports = Patient;