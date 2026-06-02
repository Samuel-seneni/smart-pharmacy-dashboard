const express = require("express");

const {
  addMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");

const router = express.Router();

/*
========================
MEDICINE ROUTES
========================
*/

router.post("/", addMedicine);
router.get("/", getMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;