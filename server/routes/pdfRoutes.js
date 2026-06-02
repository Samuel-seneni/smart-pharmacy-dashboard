const express = require("express");

const {
  generateSalesPDF,
  generateInventoryPDF,
  generateLowStockPDF,
} = require("../controllers/pdfController");

const router = express.Router();

/*
========================
PDF ROUTES
========================
*/

router.get("/sales", generateSalesPDF);

router.get("/inventory", generateInventoryPDF);

router.get("/low-stock", generateLowStockPDF);

module.exports = router;