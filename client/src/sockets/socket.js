import { io } from "socket.io-client";

/*
========================================
SOCKET URL CONFIGURATION (VITE SAFE)
========================================
- Uses VITE environment variables
- Falls back to localhost for development
========================================
*/

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

/*
========================================
SOCKET INSTANCE
========================================
*/

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // fallback support
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

/*
========================================
SOCKET DEBUG (OPTIONAL BUT USEFUL)
========================================
*/

socket.on("connect", () => {
  console.log("⚡ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("🚨 Socket connection error:", error.message);
});

/*
========================================
EXPORT SOCKET
========================================
*/

export default socket;