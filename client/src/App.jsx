import { BrowserRouter, Routes, Route } from "react-router-dom";

/* PAGES */
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import SalesPOS from "./pages/SalesPOS";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Alerts from "./pages/Alerts";
import AdminDashboard from "./pages/AdminDashboard";
import ActivityLogs from "./pages/ActivityLogs";
import Patients from "./pages/Patients";

/* LAYOUT */
import MainLayout from "./layouts/MainLayout";

/* AUTH GUARDS */
import PrivateRoute from "./routes/PrivateRoute";
import RoleRoute from "./routes/RoleRoute";

/* NOT FOUND PAGE */
const NotFound = () => (
  <div className="flex items-center justify-center h-screen text-xl font-bold">
    404 - Page Not Found
  </div>
);

/* PROTECTED WRAPPER (CLEAN ERP STRUCTURE) */
const ProtectedLayout = ({ roles, children }) => (
  <PrivateRoute>
    <RoleRoute allowedRoles={roles}>
      <MainLayout>{children}</MainLayout>
    </RoleRoute>
  </PrivateRoute>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* =========================
            DEFAULT DASHBOARD
        ========================= */}
        <Route
          path="/"
          element={
            <ProtectedLayout roles={["admin", "pharmacist", "cashier"]}>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        {/* =========================
            ADMIN DASHBOARD
        ========================= */}
        <Route
          path="/admin"
          element={
            <ProtectedLayout roles={["admin"]}>
              <AdminDashboard />
            </ProtectedLayout>
          }
        />

        {/* =========================
            PATIENTS
        ========================= */}
        <Route
          path="/patients"
          element={
            <ProtectedLayout roles={["admin", "pharmacist", "cashier"]}>
              <Patients />
            </ProtectedLayout>
          }
        />

        {/* =========================
            ALERTS
        ========================= */}
        <Route
          path="/alerts"
          element={
            <ProtectedLayout roles={["admin", "pharmacist"]}>
              <Alerts />
            </ProtectedLayout>
          }
        />

        {/* =========================
            MEDICINES
        ========================= */}
        <Route
          path="/medicines"
          element={
            <ProtectedLayout roles={["admin", "pharmacist"]}>
              <Medicines />
            </ProtectedLayout>
          }
        />

        {/* =========================
            SALES
        ========================= */}
        <Route
          path="/sales"
          element={
            <ProtectedLayout roles={["admin", "pharmacist"]}>
              <Sales />
            </ProtectedLayout>
          }
        />

        {/* =========================
            INVENTORY
        ========================= */}
        <Route
          path="/inventory"
          element={
            <ProtectedLayout roles={["admin", "inventory_manager"]}>
              <Inventory />
            </ProtectedLayout>
          }
        />

        {/* =========================
            REPORTS
        ========================= */}
        <Route
          path="/reports"
          element={
            <ProtectedLayout roles={["admin"]}>
              <Reports />
            </ProtectedLayout>
          }
        />

        {/* =========================
            POS SYSTEM
        ========================= */}
        <Route
          path="/pos"
          element={
            <ProtectedLayout roles={["admin", "pharmacist", "cashier"]}>
              <SalesPOS />
            </ProtectedLayout>
          }
        />

        {/* =========================
            ACTIVITY LOGS
        ========================= */}
        <Route
          path="/logs"
          element={
            <ProtectedLayout roles={["admin"]}>
              <ActivityLogs />
            </ProtectedLayout>
          }
        />

        {/* =========================
            FALLBACK ROUTE
        ========================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;