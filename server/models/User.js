const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
      },
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: { msg: "Please provide a valid email" },
        notEmpty: { msg: "Email is required" },
      },
      set(value) {
        // ✅ FIX: prevents login mismatch (CASE ISSUE)
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(
        "admin",
        "pharmacist",
        "cashier",
        "inventory_manager"
      ),
      allowNull: false,
      defaultValue: "cashier",
      set(value) {
        // ✅ FIX: ensures consistency
        this.setDataValue("role", value.toLowerCase().trim());
      },
    },

    status: {
      type: DataTypes.ENUM("active", "inactive", "suspended"),
      defaultValue: "active",
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // 🔥 READY FOR PERMISSION SYSTEM (ERP UPGRADE)
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    timestamps: true,

    // ✅ IMPORTANT FIX: avoids hidden password leaks
    defaultScope: {
      attributes: {
        exclude: ["password"],
      },
    },

    // 🔐 used ONLY for login
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);

module.exports = User;