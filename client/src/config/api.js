const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const SOCKET_URL = API_URL;

export const REPORTS_PDF_URL = `${API_URL}/api/reports/pdf`;

export default API_URL;