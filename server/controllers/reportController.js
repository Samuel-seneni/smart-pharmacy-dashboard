const { Op } = require("sequelize");

const Medicine = require("../models/Medicine");
const Sale = require("../models/Sale");

const lowStockReport = async (req, res) => {
  try {

    const medicines = await Medicine.findAll({
      where: {
        quantity: {
          [Op.lt]: 10,
        },
      },
    });

    res.json(medicines);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const expiringMedicinesReport = async (req, res) => {

  try {

    const today = new Date();

    const next30Days = new Date();

    next30Days.setDate(
      next30Days.getDate() + 30
    );

    const medicines = await Medicine.findAll({
      where: {
        expiryDate: {
          [Op.between]: [
            today,
            next30Days,
          ],
        },
      },
    });

    res.json(medicines);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const totalSalesReport = async (req, res) => {

  try {

    const sales = await Sale.findAll();

    const totalRevenue = sales.reduce(
      (sum, sale) =>
        sum + sale.totalPrice,
      0
    );

    res.json({
      totalSales: sales.length,
      totalRevenue,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const monthlySalesReport = async (req, res) => {

  try {

    const currentMonth =
      new Date().getMonth();

    const currentYear =
      new Date().getFullYear();

    const sales = await Sale.findAll();

    const monthlySales = sales.filter(
      (sale) => {

        const saleDate =
          new Date(sale.createdAt);

        return (
          saleDate.getMonth() ===
            currentMonth &&
          saleDate.getFullYear() ===
            currentYear
        );

      }
    );

    const revenue =
      monthlySales.reduce(
        (sum, sale) =>
          sum + sale.totalPrice,
        0
      );

    res.json({
      salesCount:
        monthlySales.length,
      revenue,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  lowStockReport,
  expiringMedicinesReport,
  totalSalesReport,
  monthlySalesReport,
};