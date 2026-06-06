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
  const medicineIdNum = Number(medicineId);
  const qty = Number(quantity || 0);

  const medicine = await Medicine.findByPk(medicineIdNum);

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  const previousStock = Number(medicine.quantity || 0);

  let newStock = previousStock;

  // ================= IN =================
  if (type === "IN") {
    newStock = previousStock + quantity;
  }

  // ================= OUT =================
  if (type === "OUT") {
    if (previousStock < qty) {
      throw new Error("Insufficient stock");
    }
    newStock = previousStock - qty;
  }

  // Update medicine stock
  medicine.quantity = newStock;
  await medicine.save();

  if (global.io?.emit) {
    global.io.emit("stockUpdated", {
      medicineId: medicineIdNum,
      newStock,
      type,
    });
  }

  // Inventory log (simple log table)
  await Inventory.create({
    medicineId: medicineIdNum,
    type,
    quantity: qty,
    note: reference,
  });

  // Audit log (ERP tracking)
  await InventoryAudit.create({
    medicineId: medicineIdNum,
    action: type,
    quantity: qty,
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

const stockOut = async (payload) => {
  const body = payload?.body || payload || {};

  return updateStock({
    medicineId: body.medicineId ?? payload.medicineId,
    quantity: body.quantity ?? payload.quantity,
    type: "OUT",
    reference: body.note || payload.note || "SALE",
    performedBy: payload.user?.email || payload.performedBy || "system",
  });
};

module.exports = {
  updateStock,
  stockOut,
};