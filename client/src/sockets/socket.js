import { io } from "socket.io-client";

// IMPORTANT: use backend URL (NOT localhost in production)
const SOCKET_URL = "https://smart-pharmacy-dashboard-1.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  withCredentials: true,
});

// connection logs (debug)
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

export default socket;