const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // later restrict to frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make io globally accessible
global.io = io;

/*
========================
SOCKET EVENTS NAMES
========================
*/
const EVENTS = {
  STOCK_UPDATED: "stock_updated",
  INVENTORY_LOG: "inventory_log",
  NEW_SALE: "new_sale",
  LOW_STOCK_ALERT: "low_stock_alert",
  DASHBOARD_REFRESH: "dashboard_refresh",
};

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // Optional: join ERP rooms (future scaling)
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`📦 Socket joined room: ${room}`);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`📦 Socket left room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/*
========================
HELPER FUNCTIONS (GLOBAL USAGE)
========================
You will call these inside controllers
*/

// 1. STOCK UPDATE EVENT
global.emitStockUpdate = (medicine) => {
  io.emit(EVENTS.STOCK_UPDATED, {
    medicineId: medicine.id,
    name: medicine.name,
    quantity: medicine.quantity,
    price: medicine.price,
  });
};

// 2. INVENTORY LOG EVENT
global.emitInventoryLog = (log) => {
  io.emit(EVENTS.INVENTORY_LOG, log);
};

// 3. NEW SALE EVENT
global.emitNewSale = (sale) => {
  io.emit(EVENTS.NEW_SALE, sale);
};

// 4. LOW STOCK ALERT
global.emitLowStockAlert = (medicine) => {
  io.emit(EVENTS.LOW_STOCK_ALERT, {
    medicineId: medicine.id,
    name: medicine.name,
    quantity: medicine.quantity,
  });
};

// 5. DASHBOARD REFRESH (generic fallback)
global.emitDashboardRefresh = () => {
  io.emit(EVENTS.DASHBOARD_REFRESH, true);
};

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});