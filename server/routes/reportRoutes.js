const express = require("express");

const {
  lowStockReport,
  expiringMedicinesReport,
  totalSalesReport,
  monthlySalesReport,
} = require("../controllers/reportController");

const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");
const Patient = require("../models/Patient");

const router = express.Router();

/*
========================
SUMMARY DASHBOARD KPI
========================
*/
router.get("/summary", async (req, res) => {
  try {
    const totalSales = await Sale.count();

    const totalRevenue = await Sale.sum("totalPrice");

    const totalMedicines = await Medicine.count();

    const lowStock = await Medicine.count({
      where: {
        quantity: { [require("sequelize").Op.lte]: 10 },
      },
    });

    const totalPatients = await Patient.count();

    res.json({
      success: true,
      data: {
        totalSales,
        totalRevenue: totalRevenue || 0,
        totalMedicines,
        lowStock,
        totalPatients,
      },
    });

  } catch (error) {
    console.error("SUMMARY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
========================
EXISTING REPORTS
========================
*/
router.get("/low-stock", lowStockReport);
router.get("/expiring", expiringMedicinesReport);
router.get("/sales", totalSalesReport);
router.get("/monthly-sales", monthlySalesReport);

module.exports = router;