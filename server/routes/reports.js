const express = require("express");
const router = express.Router();
const { Op } = require("sequelize"); // if using sequelize

const Sales = require("../models/Sale");
const Medicine = require("../models/Medicine");

// ---------------- REPORT SUMMARY ----------------
router.get("/summary", async (req, res) => {
  try {
    const { from, to } = req.query;

    // DATE FILTER
    const dateFilter =
      from && to
        ? {
            createdAt: {
              [Op.between]: [
                new Date(from),
                new Date(to)
              ],
            },
          }
        : {};

    // SALES COUNT + REVENUE
    const sales = await Sales.findAll({
      where: dateFilter,
    });

    const totalSales = sales.length;

    const revenue = sales.reduce(
      (sum, s) => sum + (s.totalPrice || 0),
      0
    );

    // MEDICINES COUNT
    const totalMedicines = await Medicine.count();

    // LOW STOCK
    const lowStock = await Medicine.count({
      where: {
        quantity: { [Op.lt]: 10 },
      },
    });

    // INVENTORY MOVEMENTS (optional placeholder)
    const inventory = totalMedicines;

    res.json({
      sales: totalSales,
      revenue,
      inventory,
      lowStock,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Report summary error"
    });
  }
});

module.exports = router;