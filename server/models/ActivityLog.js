const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ActivityLog = sequelize.define("ActivityLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
  },

  role: {
    type: DataTypes.STRING,
  },

  action: {
    type: DataTypes.STRING,
  },

  route: {
    type: DataTypes.STRING,
  },

  method: {
    type: DataTypes.STRING,
  },

  ipAddress: {
    type: DataTypes.STRING,
  },

  userAgent: {
    type: DataTypes.TEXT,
  },

  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ActivityLog;