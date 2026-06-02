const express = require("express");
const router = express.Router();

const {
  getPatients,
  createPatient,
  getPatientHistory,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const { protect } = require("../middleware/authMiddleware");

/*
========================
PATIENT ROUTES (ERP)
========================
*/

router.get("/", protect, getPatients);

router.get("/:id", protect, getPatientById);

router.post("/", protect, createPatient);

router.put("/:id", protect, updatePatient);

router.delete("/:id", protect, deletePatient);

router.get("/:id/history", protect, getPatientHistory);

module.exports = router;