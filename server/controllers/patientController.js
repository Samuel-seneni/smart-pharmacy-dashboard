const Patient = require("../models/Patient");
const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");

/*
========================
CREATE PATIENT
========================
*/
const createPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, medicalHistory } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
      medicalHistory,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================
GET ALL PATIENTS
========================
*/
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      patients,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================
GET SINGLE PATIENT
========================
*/
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      patient,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================
UPDATE PATIENT
========================
*/
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    await patient.update(req.body);

    res.json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================
DELETE PATIENT
========================
*/
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    await patient.destroy();

    res.json({
      success: true,
      message: "Patient deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================
PATIENT HISTORY (ERP CORE)
========================
*/
const getPatientHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const sales = await Sale.findAll({
      where: { patientId: id },
      include: [
        {
          model: Medicine,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      patient,
      sales,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientHistory,
};