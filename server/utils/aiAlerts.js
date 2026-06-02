const Medicine = require("../models/Medicine");
const { getIO } = require("../sockets/socketServer");

/*
========================
LOW STOCK ALERT
========================
*/
const checkLowStock = async () => {

  const medicines = await Medicine.findAll();

  medicines.forEach((med) => {

    if (med.quantity < 10) {

      const io = getIO();

      const alert = {
        type: "LOW_STOCK",
        message: `${med.name} is running low (${med.quantity} left)`,
        severity: "high",
      };

      io.emit("alert", alert);

      console.log("🚨 LOW STOCK ALERT:", alert.message);
    }

  });

};

module.exports = {
  checkLowStock,
};