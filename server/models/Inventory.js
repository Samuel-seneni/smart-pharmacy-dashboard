const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // 🔗 MEDICINE LINK (FOREIGN KEY)
    medicineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Medicines", // must match table name
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    type: {
      type: DataTypes.ENUM("IN", "OUT"),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },

    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Inventory;