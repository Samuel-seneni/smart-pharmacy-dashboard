const DEFAULT_API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://smart-pharmacy-dashboard-1.onrender.com");

const DEFAULT_SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || DEFAULT_API_URL;

const config = {
  API_URL: DEFAULT_API_URL,
  SOCKET_URL: DEFAULT_SOCKET_URL,
};

export default config;