import { useEffect, useState } from "react";
import { Bell, LogOut, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Navbar() {
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [openNotif, setOpenNotif] = useState(false);

  const navigate = useNavigate();

  // ================= LOAD USER =================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser || null);
  }, []);

  const role = user?.role?.toLowerCase() || "guest";

  // ================= SEARCH MEDICINES =================
  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const res = await api.get(`/medicines?search=${value}`);
      setResults(res.data.medicines || []);
    } catch {
      setResults([]);
    }
  };

  // ================= NOTIFICATIONS =================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/alerts");
        const alerts = Array.isArray(res.data) ? res.data : [];

        const highAlerts = alerts.filter(a => a.severity === "high");
        setNotifications(highAlerts);
      } catch {
        setNotifications([]);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="w-full h-14 bg-white shadow flex items-center justify-between px-4 border-b">

      {/* ================= LEFT LOGO ================= */}
      <div className="font-bold text-blue-600">
        Smart Pharmacy Dashboard
      </div>

      {/* ================= CENTER SEARCH ================= */}
      <div className="relative w-80 hidden md:block">

        <div className="flex items-center border rounded-md px-2">
          <Search size={16} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search medicines..."
            className="w-full px-2 py-1 text-sm focus:outline-none"
          />
        </div>

        {/* SEARCH RESULTS */}
        {results.length > 0 && (
          <div className="absolute top-10 left-0 w-full bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">

            {results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(`/medicines?highlight=${item.id}`);
                  setSearch("");
                  setResults([]);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                💊 {item.name}
              </div>
            ))}

          </div>
        )}
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center gap-4">

        {/* ================= NOTIFICATIONS ================= */}
        <div className="relative">

          <button onClick={() => setOpenNotif(!openNotif)}>
            <Bell className="text-gray-600" />
          </button>

          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {notifications.length}
            </span>
          )}

          {/* DROPDOWN */}
          {openNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">

              <div className="p-2 border-b font-semibold text-sm">
                Alerts
              </div>

              {notifications.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No alerts
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border-b hover:bg-gray-50 text-sm"
                  >
                    ⚠️ {n.message || "High risk alert"}
                  </div>
                ))
              )}

            </div>
          )}
        </div>

        {/* ================= USER INFO ================= */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={16} />
          <span>{user.name}</span>

          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
            {role}
          </span>
        </div>

        {/* ================= LOGOUT ================= */}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600"
        >
          <LogOut size={18} />
        </button>

      </div>
    </div>
  );
}

export default Navbar;