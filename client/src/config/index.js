const DEFAULT_BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://smart-pharmacy-dashboard-1.onrender.com");

const API_URL = `${DEFAULT_BACKEND_URL.replace(/\/$/, "")}/api`;
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || DEFAULT_BACKEND_URL.replace(/\/$/, "");

const config = {
  API_URL,
  SOCKET_URL,
};

export default config;