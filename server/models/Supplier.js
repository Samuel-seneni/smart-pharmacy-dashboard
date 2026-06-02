const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Supplier = sequelize.define("Supplier", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: DataTypes.STRING,
  email: DataTypes.STRING,
  address: DataTypes.STRING,
});

module.exports = Supplier;