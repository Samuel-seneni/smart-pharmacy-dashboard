const ActivityLog = require("../models/ActivityLog");

const activityLogger = async (req, res, next) => {
  try {
    if (req.user) {
      await ActivityLog.create({
        userId: req.user.id,
        name: req.user.name,
        role: req.user.role,
        action: `${req.method} ${req.originalUrl}`,
        route: req.originalUrl,
        method: req.method,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
    }
  } catch (error) {
    console.log("Logging error:", error.message);
  }

  next();
};

module.exports = activityLogger;