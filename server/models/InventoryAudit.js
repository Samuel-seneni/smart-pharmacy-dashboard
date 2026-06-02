const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const InventoryAudit = sequelize.define("InventoryAudit", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  medicineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  action: {
    type: DataTypes.ENUM("IN", "OUT", "SALE", "ADJUSTMENT"),
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  previousStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  newStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  reference: {
    type: DataTypes.STRING, // sale id, restock note, etc
    allowNull: true,
  },

  performedBy: {
    type: DataTypes.STRING, // user/email
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = InventoryAudit;