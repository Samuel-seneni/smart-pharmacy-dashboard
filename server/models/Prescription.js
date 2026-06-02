const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Prescription = sequelize.define("Prescription", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  doctorName: {
    type: DataTypes.STRING,
  },

  medicines: {
    type: DataTypes.TEXT,
  },

  notes: {
    type: DataTypes.TEXT,
  },

});

module.exports = Prescription;