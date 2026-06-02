const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Supplier = require("./Supplier");

const Medicine = sequelize.define("Medicine", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: DataTypes.STRING,
  category: DataTypes.STRING,
  batchNumber: DataTypes.STRING,
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
  expiryDate: DataTypes.DATE,

  SupplierId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

// RELATIONSHIP
Medicine.belongsTo(Supplier, { foreignKey: "SupplierId" });
Supplier.hasMany(Medicine, { foreignKey: "SupplierId" });

module.exports = Medicine;