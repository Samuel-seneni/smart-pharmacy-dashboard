const User = require("./User");
const Medicine = require("./Medicine");
const Supplier = require("./Supplier");
const Sale = require("./Sale");
const Alert = require("./Alert");
const Patient = require("./Patient");
const Prescription = require("./Prescription");
const Inventory = require("./Inventory");
const InventoryAudit = require("./InventoryAudit");

/*
========================
RELATIONSHIPS (ERP CORE)
========================
*/


// Medicine → Audit Logs
Medicine.hasMany(InventoryAudit, {
  foreignKey: "medicineId",
  as: "audits",
});

InventoryAudit.belongsTo(Medicine, {
  foreignKey: "medicineId",
  as: "medicine",
});
// ================= SUPPLIER → MEDICINE =================
Supplier.hasMany(Medicine, {
  foreignKey: "supplierId",
  as: "medicines",
});

Medicine.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});

// ================= MEDICINE → SALES =================
Medicine.hasMany(Sale, {
  foreignKey: "medicineId",
  as: "sales",
  onDelete: "CASCADE",
});

Sale.belongsTo(Medicine, {
  foreignKey: "medicineId",
  as: "medicine",
});

// ================= PATIENT → SALES (CORE ERP LINK) =================
Patient.hasMany(Sale, {
  foreignKey: "patientId",
  as: "sales",
  onDelete: "SET NULL",
});

Sale.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

// ================= MEDICINE → INVENTORY =================
Medicine.hasMany(Inventory, {
  foreignKey: "medicineId",
  as: "inventoryLogs",
});

Inventory.belongsTo(Medicine, {
  foreignKey: "medicineId",
  as: "medicine",
});

// ================= PATIENT → PRESCRIPTION =================
Patient.hasMany(Prescription, {
  foreignKey: "patientId",
  as: "prescriptions",
  onDelete: "CASCADE",
});

Prescription.belongsTo(Patient, {
  foreignKey: "patientId",
  as: "patient",
});

/*
========================
EXPORT MODELS
========================
*/
module.exports = {
  User,
  Medicine,
  Supplier,
  Sale,
  Alert,
  Patient,
  Prescription,
  Inventory,
  InventoryAudit,
};