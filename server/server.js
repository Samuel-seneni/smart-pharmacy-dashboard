const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const saleRoutes = require("./routes/saleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const reportsRoutes = require("./routes/reports");
const userRoutes = require("./routes/userRoutes");
const activityLogger = require("./middleware/activityLogger");
const logRoutes = require("./routes/logRoutes");
const patientRoutes = require("./routes/patientRoutes");





const { sequelize, connectDB } = require("./config/db");

// Load all models and relationships
require("./models");

const app = express();

/*
========================
MIDDLEWARE
========================
*/
app.use(cors());
app.use(express.json());

/*
========================
ROUTES
========================
*/
app.get("/", (req, res) => {
  res.send("Smart Pharmacy API Running...");
});

// API Routes
// Middleware FIRST
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Smart Pharmacy API Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/medicines", medicineRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", saleRoutes);

app.use("/api/patients", patientRoutes);   // ✔ important

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/reports/pdf", pdfRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/logs", logRoutes);
app.use("/api/alerts", require("./routes/alertRoutes"));

// activity logger LAST (or remove global usage)
app.use(activityLogger);


/*
========================
GLOBAL ERROR HANDLER
========================
*/
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

/*
========================
START SERVER
========================
*/
const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Sync Models
    await sequelize.sync({ alter: true });
    console.log("✅ Database Synced");

    /*
    ========================
    AI LOW STOCK CHECK
    ========================
    */
    try {
      const { checkLowStock } = require("./utils/aiAlerts");

      setInterval(async () => {
        try {
          await checkLowStock();
        } catch (error) {
          console.error("❌ AI Alert Error:", error.message);
        }
      }, 30000);

      console.log("🤖 AI Alert Service Started");
    } catch (error) {
      console.log("⚠️ AI Alerts not configured yet");
    }

    // Start Server
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server Startup Error:", error);
  }
};

startServer();