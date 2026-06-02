const PDFDocument = require("pdfkit");

const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");

const generateSalesPDF = async (req, res) => {

  try {

    const sales = await Sale.findAll();

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("SALES REPORT", {
      align: "center",
    });

    doc.moveDown();

    let totalRevenue = 0;

    sales.forEach((sale, index) => {

      totalRevenue += sale.totalPrice;

      doc.fontSize(12).text(
        `${index + 1}. Qty: ${sale.quantity} | Total: ${sale.totalPrice} | Method: ${sale.paymentMethod}`
      );

    });

    doc.moveDown();

    doc.fontSize(14).text(
      `TOTAL REVENUE: ${totalRevenue}`
    );

    doc.end();

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const generateInventoryPDF = async (req, res) => {

  try {

    const medicines = await Medicine.findAll();

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=inventory-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("INVENTORY REPORT", {
      align: "center",
    });

    doc.moveDown();

    medicines.forEach((med, index) => {

      doc.fontSize(12).text(
        `${index + 1}. ${med.name} | Stock: ${med.quantity} | Expiry: ${med.expiryDate}`
      );

    });

    doc.end();

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

const generateLowStockPDF = async (req, res) => {

  try {

    const medicines = await Medicine.findAll();

    const lowStock = medicines.filter(
      m => m.quantity < 10
    );

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=low-stock-report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("LOW STOCK REPORT", {
      align: "center",
    });

    doc.moveDown();

    lowStock.forEach((med, index) => {

      doc.fontSize(12).text(
        `${index + 1}. ${med.name} | Stock: ${med.quantity}`
      );

    });

    doc.end();

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  generateSalesPDF,
  generateInventoryPDF,
  generateLowStockPDF,
};