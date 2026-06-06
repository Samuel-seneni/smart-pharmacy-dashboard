const Alert = require("../models/Alert");

// GET ALL ALERTS
const getAlerts = async (req, res) => {
  try {

    const alerts = await Alert.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(alerts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAlertAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    alert.status = "read";
    await alert.save();

    res.json({
      success: true,
      message: "Alert marked as read",
      alert,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAlerts,
  markAlertAsRead,
};