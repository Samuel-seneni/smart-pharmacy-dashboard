const ActivityLog = require("../models/ActivityLog");

/*
========================
GET ALL LOGS (ADMIN)
========================
*/
const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getLogs,
};