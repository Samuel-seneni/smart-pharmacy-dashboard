const { Server } = require("socket.io");

const EVENTS = {
  STOCK_UPDATED: "stock_updated",
  INVENTORY_LOG: "inventory_log",
  NEW_SALE: "new_sale",
  LOW_STOCK_ALERT: "low_stock_alert",
  DASHBOARD_REFRESH: "dashboard_refresh",
};

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: (
        process.env.ALLOWED_ORIGINS ||
        "http://localhost:3000,http://localhost:5173,https://smart-pharmacy-dashboard-chi.vercel.app,https://smart-pharmacy-dashboard-rouge.vercel.app"
      )
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  global.io = io;

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`📦 joined room: ${room}`);
    });

    socket.on("leave_room", (room) => {
      socket.leave(room);
      console.log(`📦 left room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  // GLOBAL EMITTERS
  global.emitStockUpdate = (medicine) => {
    io.emit(EVENTS.STOCK_UPDATED, medicine);
  };

  global.emitInventoryLog = (log) => {
    io.emit(EVENTS.INVENTORY_LOG, log);
  };

  global.emitNewSale = (sale) => {
    io.emit(EVENTS.NEW_SALE, sale);
  };

  global.emitLowStockAlert = (medicine) => {
    io.emit(EVENTS.LOW_STOCK_ALERT, medicine);
  };

  global.emitDashboardRefresh = () => {
    io.emit(EVENTS.DASHBOARD_REFRESH, true);
  };

  console.log("⚡ Socket.IO initialized");

  return io;
}

module.exports = initSocket;