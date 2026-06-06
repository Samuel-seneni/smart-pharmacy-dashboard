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
const seedAdmin = require("./scripts/seedAdmin");

const { sequelize, connectDB } = require("./config/db");

require("./models");

/*
=====================================
APP + HTTP SERVER
=====================================
*/

const app = express();
const server = http.createServer(app);

/*
=====================================
ALLOWED ORIGINS
=====================================
*/

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:3000,http://localhost:5173,https://smart-pharmacy-dashboard-chi.vercel.app,https://smart-pharmacy-dashboard-rouge.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/*
=====================================
EXPRESS MIDDLEWARE
=====================================
*/

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman and server-to-server requests
      if (!origin) return callback(null, true);

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy: Origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());

/*
=====================================
SOCKET.IO
=====================================
*/

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Global access
global.io = io;

io.on("connection", (socket) => {
  console.log(`⚡ Client Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`📦 Joined Room: ${room}`);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`📦 Left Room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client Disconnected: ${socket.id}`);
  });
});

/*
=====================================
ROOT ROUTE
=====================================
*/

app.get("/", (req, res) => {
  res.send("✅ Smart Pharmacy API Running...");
});

/*
=====================================
API ROUTES
=====================================
*/

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
=====================================
ACTIVITY LOGGER
=====================================
*/

app.use(activityLogger);

/*
=====================================
GLOBAL ERROR HANDLER
=====================================
*/

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : undefined,
  });
});

/*
=====================================
START SERVER
=====================================
*/

const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ Database Connected");

    try {
      await seedAdmin();
      console.log("✅ Admin seed check completed");
    } catch (seedErr) {
      console.warn("⚠️ Admin seed skipped:", seedErr.message);
    }

    console.log("✅ Database Synced");

    /*
    =====================================
    AI LOW STOCK ALERT SERVICE
    =====================================
    */

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
      console.log("⚠️ AI Alerts not configured.");
    }

    const PORT = Number(process.env.PORT || 5000);
    let retryCount = 0;
    let retryTimer = null;

    const startListening = () => {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }

      const onError = (err) => {
        if (err && err.code === "EADDRINUSE") {
          if (retryCount < 5) {
            retryCount += 1;
            console.warn(
              `⚠️ Port ${PORT} is busy. Retrying in 2 seconds... (${retryCount}/5)`
            );
            retryTimer = setTimeout(startListening, 2000);
            return;
          }

          console.error(`❌ Port ${PORT} is still unavailable after 5 attempts.`);
          process.exit(1);
        }

        console.error("❌ Server Startup Error");
        console.error(err);
        process.exit(1);
      };

      server.once("error", onError);

      server.listen(PORT, () => {
        retryCount = 0;
        server.removeListener("error", onError);
        console.log("=================================");
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 http://localhost:${PORT}`);
        console.log("⚡ Socket.IO Ready");
        console.log("=================================");
      });
    };

    startListening();
  } catch (error) {
    console.error("❌ Server Startup Error");
    console.error(error);
  }
};

startServer();