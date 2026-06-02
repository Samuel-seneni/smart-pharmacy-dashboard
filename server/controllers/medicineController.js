const { Op } = require("sequelize");
const Medicine = require("../models/Medicine");
/*
========================
ADD MEDICINE
========================
*/
const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      message: "Medicine added successfully",
      medicine,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================
GET ALL MEDICINES
========================
*/
const getMedicines = async (req, res) => {
  try {

    const medicines = await Medicine.findAll();

    // 🟡 LOW STOCK ALERT
    const lowStock = medicines.filter(m => m.quantity < 10);

    // 🔴 EXPIRED MEDICINES
    const expired = medicines.filter(m =>
      new Date(m.expiryDate) < new Date()
    );

    // 🟢 VALID MEDICINES
    const valid = medicines.filter(m =>
      new Date(m.expiryDate) >= new Date()
    );

    res.json({
      totalMedicines: medicines.length,
      lowStockCount: lowStock.length,
      expiredCount: expired.length,

      lowStock,
      expired,
      valid,
      medicines
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================
GET SINGLE MEDICINE
========================
*/
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================
UPDATE MEDICINE
========================
*/
const updateMedicine = async (req, res) => {
  try {

    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await medicine.update(req.body);

    res.json({
      message: "Medicine updated successfully",
      medicine,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================
DELETE MEDICINE
========================
*/
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await medicine.destroy();

    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};