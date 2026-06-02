const express = require("express");

const {
  getFinancialSummary,
  getMedicineSummary,
  getInventorySummary,
  getTopMedicines,
  getDashboardOverview,
  getRevenueTrend,
  getLowStockWidget,
  getExpiryWidget,

} = require("../controllers/dashboardController");

const router = express.Router();

/*
========================
DASHBOARD ROUTES
========================
*/

router.get("/financial", getFinancialSummary);
router.get("/medicine", getMedicineSummary);
router.get("/inventory", getInventorySummary);
router.get("/top-medicines", getTopMedicines);
router.get("/overview", getDashboardOverview);
router.get("/revenue-trend", getRevenueTrend);
router.get("/low-stock-widget", getLowStockWidget);
router.get("/expiry-widget", getExpiryWidget);

module.exports = router;