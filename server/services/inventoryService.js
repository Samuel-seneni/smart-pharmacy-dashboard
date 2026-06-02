const { Inventory, Medicine, InventoryAudit, Alert } = require("../models");

/*
=================================================
ERP INVENTORY ENGINE (SINGLE SOURCE OF TRUTH)
=================================================
*/

const updateStock = async ({
  medicineId,
  quantity,
  type, // "IN" | "OUT"
  reference = null,
  performedBy = "system",
}) => {
  const medicine = await Medicine.findByPk(medicineId);

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  const previousStock = medicine.quantity;

  let newStock = previousStock;

  // ================= IN =================
  if (type === "IN") {
    newStock = previousStock + quantity;
  }

  // ================= OUT =================
  if (type === "OUT") {
    if (previousStock < quantity) {
      throw new Error("Insufficient stock");
    }
    newStock = previousStock - quantity;
  }

  // Update medicine stock
  medicine.quantity = newStock;
  await medicine.save();

  global.io.emit("stockUpdated", {
  medicineId,
  newStock,
  type,
});

  // Inventory log (simple log table)
  await Inventory.create({
    medicineId,
    type,
    quantity,
    note: reference,
  });

  // Audit log (ERP tracking)
  await InventoryAudit.create({
    medicineId,
    action: type,
    quantity,
    previousStock,
    newStock,
    reference,
    performedBy,
  });

  // ================= LOW STOCK ALERT =================
  if (newStock <= 10) {
    await Alert.create({
      type: "LOW_STOCK",
      message: `${medicine.name} is low on stock (${newStock})`,
    });
  }

  return {
    medicineId,
    previousStock,
    newStock,
  };
};

module.exports = {
  updateStock,
};