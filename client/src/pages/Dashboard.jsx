import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  TrendingUp,
  Pill,
  AlertTriangle,
  ShoppingCart,
  Activity,
  CalendarClock,
} from "lucide-react";

import socket from "../sockets/socket";


function Dashboard() {
  const [overview, setOverview] = useState({});
  const [trend, setTrend] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiry, setExpiry] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();

    // ================= REAL-TIME UPDATES =================
    socket.on("stock-updated", () => {
      loadDashboard();
    });

    socket.on("sale-created", () => {
      loadDashboard();
    });

    socket.on("inventory-updated", () => {
      loadDashboard();
    });

    return () => {
      socket.off("stock-updated");
      socket.off("sale-created");
      socket.off("inventory-updated");
    };
  }, []);

  // ================= LOAD DASHBOARD =================
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [o, t, l, e] = await Promise.all([
        api.get("/dashboard/overview"),
        api.get("/dashboard/revenue-trend"),
        api.get("/dashboard/low-stock-widget"),
        api.get("/dashboard/expiry-widget"),
      ]);

      setOverview(o.data || {});
      setTrend(Array.isArray(t.data) ? t.data : []);
      setLowStock(Array.isArray(l.data) ? l.data : []);
      setExpiry(Array.isArray(e.data) ? e.data : []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= SAFE VALUES =================
  const revenue = overview?.totalRevenue || 0;
  const sales = overview?.totalSales || 0;
  const medicines = overview?.totalMedicines || 0;
  const lowStockCount = overview?.lowStock || 0;

  return (
    <div className="space-y-6 p-2">

      {/* HEADER */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3">
        <Activity className="text-blue-600" size={28} />

        <div>
          <h1 className="text-2xl font-bold">
            Smart Pharmacy Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Real-time ERP System (Inventory + Sales + Patients)
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="p-4 bg-green-100 rounded shadow flex items-center gap-3">
          <TrendingUp className="text-green-700" />
          <div>
            <h3 className="text-sm text-gray-600">Revenue</h3>
            <p className="text-xl font-bold">KES {revenue}</p>
          </div>
        </div>

        <div className="p-4 bg-blue-100 rounded shadow flex items-center gap-3">
          <ShoppingCart className="text-blue-700" />
          <div>
            <h3 className="text-sm text-gray-600">Sales</h3>
            <p className="text-xl font-bold">{sales}</p>
          </div>
        </div>

        <div className="p-4 bg-yellow-100 rounded shadow flex items-center gap-3">
          <Pill className="text-yellow-700" />
          <div>
            <h3 className="text-sm text-gray-600">Medicines</h3>
            <p className="text-xl font-bold">{medicines}</p>
          </div>
        </div>

        <div className="p-4 bg-red-100 rounded shadow flex items-center gap-3">
          <AlertTriangle className="text-red-700" />
          <div>
            <h3 className="text-sm text-gray-600">Low Stock</h3>
            <p className="text-xl font-bold">{lowStockCount}</p>
          </div>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={18} />
          Revenue Trend (Live ERP Data)
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : trend.length === 0 ? (
          <p className="text-gray-500">No trend data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* LOW STOCK */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-3 flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} />
            Low Stock Alerts
          </h2>

          {lowStock.length === 0 ? (
            <p className="text-gray-500">No low stock items</p>
          ) : (
            lowStock.map((m) => (
              <div key={m.id} className="border-b py-2 flex justify-between">
                <span>{m.name}</span>
                <span className="text-red-500 font-bold">{m.quantity}</span>
              </div>
            ))
          )}
        </div>

        {/* EXPIRY */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold mb-3 flex items-center gap-2 text-yellow-600">
            <CalendarClock size={18} />
            Expiring Soon
          </h2>

          {expiry.length === 0 ? (
            <p className="text-gray-500">No expiry alerts</p>
          ) : (
            expiry.map((m) => (
              <div key={m.id} className="border-b py-2 flex justify-between">
                <span>{m.name}</span>
                <span className="text-yellow-600">
                  {m.expiryDate?.split("T")[0]}
                </span>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;