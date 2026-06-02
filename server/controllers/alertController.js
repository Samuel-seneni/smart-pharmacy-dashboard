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

module.exports = { getAlerts };