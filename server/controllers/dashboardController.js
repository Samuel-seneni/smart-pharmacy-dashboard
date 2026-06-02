const { Op } = require("sequelize");

const Medicine = require("../models/Medicine");
const Sale = require("../models/Sale");
const Inventory = require("../models/Inventory");

const getFinancialSummary = async (req, res) => {

  try {

    const sales = await Sale.findAll();

    const totalSales = sales.length;

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.totalPrice,
      0
    );

    const avgSaleValue =
      totalSales === 0
        ? 0
        : totalRevenue / totalSales;

    res.json({
      totalSales,
      totalRevenue,
      avgSaleValue,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const getMedicineSummary = async (req, res) => {

  try {

    const medicines = await Medicine.findAll();

    const totalMedicines = medicines.length;

    const lowStock = medicines.filter(
      m => m.quantity < 10
    ).length;

    const outOfStock = medicines.filter(
      m => m.quantity === 0
    ).length;

    const expiringSoon = medicines.filter(
      m => {
        const today = new Date();
        const expiry = new Date(m.expiryDate);

        const diffDays =
          (expiry - today) /
          (1000 * 60 * 60 * 24);

        return diffDays <= 30;
      }
    ).length;

    res.json({
      totalMedicines,
      lowStock,
      outOfStock,
      expiringSoon,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const getInventorySummary = async (req, res) => {

  try {

    const logs = await Inventory.findAll();

    const totalIn = logs.filter(
      l => l.type === "IN"
    ).length;

    const totalOut = logs.filter(
      l => l.type === "OUT"
    ).length;

    res.json({
      totalStockIn: totalIn,
      totalStockOut: totalOut,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const getTopMedicines = async (req, res) => {

  try {

    const sales = await Sale.findAll({
      include: Medicine,
    });

    const map = {};

    sales.forEach(sale => {

      const name =
        sale.Medicine?.name ||
        "Unknown";

      if (!map[name]) {
        map[name] = 0;
      }

      map[name] += sale.quantity;

    });

    const result = Object.keys(map)
      .map(name => ({
        name,
        quantity: map[name],
      }))
      .sort((a, b) =>
        b.quantity - a.quantity
      )
      .slice(0, 5);

    res.json(result);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const getDashboardOverview = async (req, res) => {

  try {

    const sales = await Sale.findAll();
    const medicines = await Medicine.findAll();

    const totalRevenue = sales.reduce(
      (sum, s) => sum + s.totalPrice,
      0
    );

    const lowStock = medicines.filter(
      m => m.quantity < 10
    ).length;

    const expiringSoon = medicines.filter(
      m => {
        const today = new Date();
        const expiry = new Date(m.expiryDate);
        return (expiry - today) /
          (1000 * 60 * 60 * 24) <= 30;
      }
    ).length;

    res.json({
      totalSales: sales.length,
      totalRevenue,
      totalMedicines: medicines.length,
      lowStock,
      expiringSoon,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const getRevenueTrend = async (req, res) => {

  try {

    const sales = await Sale.findAll();

    const last7Days = {};

    for (let i = 0; i < 7; i++) {

      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = date.toISOString().split("T")[0];

      last7Days[key] = 0;
    }

    sales.forEach(sale => {

      const date = new Date(sale.createdAt)
        .toISOString()
        .split("T")[0];

      if (last7Days[date] !== undefined) {
        last7Days[date] += sale.totalPrice;
      }

    });

    const result = Object.keys(last7Days).map(date => ({
      date,
      revenue: last7Days[date]
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

const getLowStockWidget = async (req, res) => {

  const medicines = await Medicine.findAll();

  const lowStock = medicines
    .filter(m => m.quantity <= 10)
    .slice(0, 5);

  res.json(lowStock);
};

const getExpiryWidget = async (req, res) => {

  const medicines = await Medicine.findAll();

  const today = new Date();

  const expiring = medicines
    .filter(m => {

      const expiry = new Date(m.expiryDate);

      const diff =
        (expiry - today) /
        (1000 * 60 * 60 * 24);

      return diff <= 30;

    })
    .slice(0, 5);

  res.json(expiring);
};

module.exports = {
  getFinancialSummary,
  getMedicineSummary,
  getInventorySummary,
  getTopMedicines,
  getDashboardOverview,
  getRevenueTrend,
  getLowStockWidget,
  getExpiryWidget
};