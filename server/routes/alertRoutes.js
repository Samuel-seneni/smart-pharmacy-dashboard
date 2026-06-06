const express = require("express");
const router = express.Router();

const { getAlerts, markAlertAsRead } = require("../controllers/alertController");

router.get("/", getAlerts);
router.put("/:id", markAlertAsRead);

module.exports = router;