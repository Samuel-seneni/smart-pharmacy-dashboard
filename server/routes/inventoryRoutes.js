const express = require("express");

const {
  stockIn,
  stockOut,
  getInventoryLogs,
} = require("../controllers/inventoryController");

const router = express.Router();

/*
========================
INVENTORY ROUTES
========================
*/

router.post("/in", stockIn);
router.post("/out", stockOut);
router.get("/", getInventoryLogs);

module.exports = router;