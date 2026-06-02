const express = require("express");

const {
  createSale,
  getSales,
  getSaleById,
} = require("../controllers/saleController");

const router = express.Router();

/*
========================
SALES ROUTES
========================
*/

// POS checkout
router.post("/", createSale);

// Get all sales
router.get("/", getSales);

// Get single sale
router.get("/:id", getSaleById);

module.exports = router;