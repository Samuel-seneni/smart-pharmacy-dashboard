const DEFAULT_API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://smart-pharmacy-dashboard-1.onrender.com");

const API_URL = DEFAULT_API_URL;

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || DEFAULT_API_URL;

export const REPORTS_PDF_URL = `${API_URL}/api/reports/pdf`;

export default API_URL;