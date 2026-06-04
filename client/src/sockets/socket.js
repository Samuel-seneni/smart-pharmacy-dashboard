import { io } from "socket.io-client";
import config from "../config";

const socket = io(config.SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;