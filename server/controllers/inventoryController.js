const Inventory = require("../models/Inventory");
const Medicine = require("../models/Medicine");
const InventoryAudit = require("../models/InventoryAudit");

/*
=================================================
ERP CORE STOCK ENGINE (SAFE SINGLE SOURCE RULE)
=================================================
*/
const applyStockMovement = async ({
  medicineId,
  quantity,
  type, // IN | OUT
  note = "",
  performedBy = "system",
}) => {
  const medicine = await Medicine.findByPk(medicineId);

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  const previousStock = Number(medicine.quantity || 0);
  const qty = Number(quantity);

  let newStock = previousStock;

  // ================= STOCK IN =================
  if (type === "IN") {
    newStock = previousStock + qty;
  }

  // ================= STOCK OUT =================
  if (type === "OUT") {
    if (previousStock < qty) {
      throw new Error("Insufficient stock");
    }
    newStock = previousStock - qty;
  }

  // UPDATE MEDICINE STOCK
  medicine.quantity = newStock;
  await medicine.save();

  // INVENTORY LOG
  const inventoryLog = await Inventory.create({
    medicineId,
    type,
    quantity: qty,
    note,
  });

  // AUDIT LOG
  const auditLog = await InventoryAudit.create({
    medicineId,
    action: type,
    quantity: qty,
    previousStock,
    newStock,
    reference: note,
    performedBy,
  });

  /*
  ============================
  REAL-TIME SOCKET UPDATES
  ============================
  */
  if (global.io) {
    // 1. Stock update event
    global.io.emit("stock_updated", {
      medicineId,
      name: medicine.name,
      previousStock,
      newStock,
      type,
    });

    // 2. Inventory log event
    global.io.emit("inventory_log", {
      inventoryLog,
      auditLog,
    });

    // 3. Dashboard refresh trigger
    global.io.emit("dashboard_refresh", true);

    // 4. Low stock alert
    if (newStock <= 10) {
      global.io.emit("low_stock_alert", {
        medicineId,
        name: medicine.name,
        quantity: newStock,
      });
    }
  }

  return {
    medicineId,
    previousStock,
    newStock,
    type,
  };
};

/*
========================
STOCK IN (RESTOCK)
========================
*/
const stockIn = async (req, res) => {
  try {
    const { medicineId, quantity, note } = req.body;

    const result = await applyStockMovement({
      medicineId,
      quantity,
      type: "IN",
      note: note || "RESTOCK",
      performedBy: req.user?.email || "admin",
    });

    res.status(201).json({
      success: true,
      message: "Stock increased successfully",
      data: result,
    });

  } catch (error) {
    console.error("STOCK IN ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/*
========================
STOCK OUT
========================
*/
const stockOut = async (req, res) => {
  try {
    const { medicineId, quantity, note } = req.body;

    const result = await applyStockMovement({
      medicineId,
      quantity,
      type: "OUT",
      note: note || "ADJUSTMENT",
      performedBy: req.user?.email || "admin",
    });

    res.status(201).json({
      success: true,
      message: "Stock reduced successfully",
      data: result,
    });

  } catch (error) {
    console.error("STOCK OUT ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/*
========================
GET INVENTORY LOGS
========================
*/
const getInventoryLogs = async (req, res) => {
  try {
    const logs = await Inventory.findAll({
      include: [
        {
          model: Medicine,
          as: "medicine",
          attributes: ["id", "name", "price", "quantity"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      logs,
    });

  } catch (error) {
    console.error("INVENTORY FETCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/*
========================
MANUAL RESTOCK WRAPPER
========================
*/
const restockMedicine = async (req, res) => {
  try {
    const { medicineId, quantity, note } = req.body;

    const result = await applyStockMovement({
      medicineId,
      quantity,
      type: "IN",
      note: note || "MANUAL RESTOCK",
      performedBy: req.user?.email || "admin",
    });

    res.json({
      success: true,
      message: "Restock successful",
      data: result,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  stockIn,
  stockOut,
  getInventoryLogs,
  restockMedicine,
};