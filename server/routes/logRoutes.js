const express = require("express");

const { getLogs } = require("../controllers/logController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

/*
========================
ADMIN LOGS
========================
*/
router.get(
  "/",
  protect,
  authorize("admin"),
  getLogs
);

module.exports = router;