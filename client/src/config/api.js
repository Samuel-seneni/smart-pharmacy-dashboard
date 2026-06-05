const DEFAULT_BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://smart-pharmacy-dashboard-1.onrender.com");

const BASE_URL = DEFAULT_BACKEND_URL.replace(/\/$/, "");
const API_URL = `${BASE_URL}/api`;

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || BASE_URL;

export const REPORTS_PDF_URL = `${API_URL}/reports/pdf`;

export default API_URL;