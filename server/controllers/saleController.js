const { Sale, Medicine, Patient } = require("../models");
const { stockOut } = require("../services/inventoryService");

/*
=================================================
CREATE SALE (POS CORE ENGINE)
=================================================
*/
const createSale = async (req, res) => {
  try {
    const {
      medicineId,
      quantity,
      paymentMethod,
      customerName,
      patientId,
    } = req.body;

    const medicine = await Medicine.findByPk(medicineId);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const qty = Number(quantity);

    // ================= STOCK VALIDATION =================
    if (medicine.quantity < qty) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    const unitPrice = Number(medicine.price || 0);
    const totalPrice = unitPrice * qty;

    /*
    =========================
    STEP 1: UPDATE INVENTORY
    (Single Source Rule via inventoryService)
    =========================
    */
    await stockOut({
      body: {
        medicineId,
        quantity: qty,
        note: `SALE - ${customerName || "Walk-in"}`,
      },
      user: req.user,
    });

    /*
    =========================
    STEP 2: CREATE SALE RECORD
    =========================
    */
    const sale = await Sale.create({
      medicineId,
      quantity: qty,
      totalPrice,
      unitPrice,
      paymentMethod,
      customerName,
      patientId: patientId || null,
    });

    /*
    =========================
    STEP 3: REAL-TIME EVENTS
    =========================
    */
    if (global.io) {
      // new sale event
      global.io.emit("new_sale", {
        sale,
      });

      // dashboard refresh
      global.io.emit("dashboard_refresh", true);

      // optional: stock update signal (already handled in inventoryService)
    }

    res.status(201).json({
      success: true,
      message: "Sale completed successfully",
      sale,
    });

  } catch (error) {
    console.error("SALE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
GET ALL SALES (ERP VIEW)
=================================================
*/
const getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        {
          model: Medicine,
          as: "medicine",
          attributes: ["id", "name", "price"],
        },
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "name", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      sales,
    });

  } catch (error) {
    console.error("GET SALES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
GET SINGLE SALE
=================================================
*/
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        {
          model: Medicine,
          as: "medicine",
        },
        {
          model: Patient,
          as: "patient",
        },
      ],
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.json({
      success: true,
      sale,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
PATIENT HISTORY
=================================================
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
          as: "medicine",
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
    console.error("PATIENT HISTORY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSale,
  getSales,
  getSaleById,
  getPatientHistory,
};