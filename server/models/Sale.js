const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Sale = sequelize.define(
  "Sale",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    medicineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    customerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },

    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Cash",
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Sale;