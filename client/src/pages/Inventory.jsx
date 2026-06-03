import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // change in production

function Inventory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /*
  ========================
  LOAD INITIAL DATA
  ========================
  */
  useEffect(() => {
    loadLogs();

    // ================= REAL-TIME SOCKETS =================
    socket.on("inventory_log", (data) => {
      setLogs((prev) => [data.inventoryLog, ...prev]);
    });

    socket.on("stock_updated", (data) => {
      console.log("Stock updated:", data);
    });

    socket.on("low_stock_alert", (data) => {
      alert(`⚠️ LOW STOCK: ${data.name} (${data.quantity})`);
    });

    return () => {
      socket.off("inventory_log");
      socket.off("stock_updated");
      socket.off("low_stock_alert");
    };
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/inventory");

      let data = [];

      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.data)) data = res.data.data;
      else if (Array.isArray(res.data.logs)) data = res.data.logs;
      else if (Array.isArray(res.data.result)) data = res.data.result;

      setLogs(data);
    } catch (err) {
      setError("Failed to load inventory data");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================
  FILTER LOGS
  ========================
  */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) =>
      (log.note || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.type || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [logs, search]);

  /*
  ========================
  STOCK SUMMARY
  ========================
  */
  const totalIn = filteredLogs
    .filter((l) => l.type === "IN")
    .reduce((sum, l) => sum + Number(l.quantity || 0), 0);

  const totalOut = filteredLogs
    .filter((l) => l.type === "OUT")
    .reduce((sum, l) => sum + Number(l.quantity || 0), 0);

  const balance = totalIn - totalOut;

  const lowStockItems = filteredLogs.filter(
    (l) => l.type === "OUT" && Number(l.quantity) <= 5
  ).length;

  /*
  ========================
  UI
  ========================
  */
  return (
    <div className="bg-white p-4 rounded-xl shadow">

      <h1 className="text-xl font-bold mb-4">
        🏥 Inventory ERP System (LIVE)
      </h1>

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">

        <div className="bg-green-100 p-3 rounded">
          <p className="text-sm">Stock IN</p>
          <p className="text-xl font-bold text-green-700">
            {totalIn}
          </p>
        </div>

        <div className="bg-red-100 p-3 rounded">
          <p className="text-sm">Stock OUT</p>
          <p className="text-xl font-bold text-red-700">
            {totalOut}
          </p>
        </div>

        <div className="bg-blue-100 p-3 rounded">
          <p className="text-sm">Balance</p>
          <p className="text-xl font-bold text-blue-700">
            {balance}
          </p>
        </div>

        <div className="bg-yellow-100 p-3 rounded">
          <p className="text-sm">Low Stock Alerts</p>
          <p className="text-xl font-bold text-yellow-700">
            {lowStockItems}
          </p>
        </div>

      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search inventory logs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {/* STATES */}
      {loading && <p className="text-gray-500">Loading live inventory...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <div className="overflow-x-auto">

          <table className="w-full border text-sm">

            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Note</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No inventory data found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const isLowStock =
                    log.type === "OUT" &&
                    Number(log.quantity) <= 5;

                  return (
                    <tr
                      key={log.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >

                      <td className="border p-2 font-bold">
                        #{log.id}
                      </td>

                      <td className="border p-2">
                        <span
                          className={`px-2 py-1 rounded text-white text-xs ${
                            log.type === "IN"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>

                      <td className="border p-2 text-center">
                        {log.quantity}
                      </td>

                      <td className="border p-2">
                        {log.note}
                      </td>

                      <td className="border p-2">
                        {isLowStock ? (
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                            OK
                          </span>
                        )}
                      </td>

                      <td className="border p-2 text-xs text-gray-600">
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : "N/A"}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Inventory;