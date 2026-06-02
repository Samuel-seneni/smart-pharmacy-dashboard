const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Alert = sequelize.define("Alert", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  type: {
    type: DataTypes.STRING,
  },

  message: {
    type: DataTypes.TEXT,
  },

  severity: {
    type: DataTypes.ENUM(
      "low",
      "medium",
      "high"
    ),
    defaultValue: "low",
  },

  status: {
    type: DataTypes.ENUM(
      "read",
      "unread"
    ),
    defaultValue: "unread",
  },

});

module.exports = Alert;