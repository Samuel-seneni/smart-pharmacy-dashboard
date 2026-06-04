const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const saleRoutes = require("./routes/saleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const userRoutes = require("./routes/userRoutes");
const logRoutes = require("./routes/logRoutes");
const patientRoutes = require("./routes/patientRoutes");
const alertRoutes = require("./routes/alertRoutes");

const activityLogger = require("./middleware/activityLogger");

const { sequelize, connectDB } = require("./config/db");

require("./models");

/*
========================
APP + SERVER SETUP
========================
*/
const app = express();
const server = http.createServer(app);

/*
========================
SOCKET.IO SETUP
========================
*/
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://smart-pharmacy-dashboard-chi.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Global access
global.io = io;

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`📦 Joined room: ${room}`);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`📦 Left room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports/pdf", pdfRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/alerts", alertRoutes);

/*
========================
ACTIVITY LOGGER
========================
*/
app.use(activityLogger);

/*
========================
ERROR HANDLER
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
    await connectDB();
    await sequelize.sync({ alter: true });

    console.log("✅ Database Synced");

    // AI ALERT SYSTEM
    try {
      const { checkLowStock } = require("./utils/aiAlerts");

      setInterval(async () => {
        try {
          await checkLowStock();
        } catch (err) {
          console.error("❌ AI Alert Error:", err.message);
        }
      }, 30000);

      console.log("🤖 AI Alert Service Started");
    } catch (err) {
      console.log("⚠️ AI Alerts not configured yet");
    }

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server Startup Error:", error);
  }
};

startServer();