import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  Package,
  FileText,
  Bell,
  Menu,
  ShieldCheck,
  Settings,
  LogOut,
  User,
  Activity
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [highAlerts, setHighAlerts] = useState(0);
  const [user, setUser] = useState(null);

  // ================= LOAD USER =================
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser || null);
  }, []);

  const role = (user?.role || "guest").toLowerCase();
  const userName = user?.name || "User";

  // ================= ROLE MENU MAP =================
  const menuByRole = {
    admin: [
      "dashboard",
      "patients",
      "medicines",
      "inventory",
      "sales",
      "pos",
      "reports",
      "alerts",
      "admin",
      "logs"
    ],

    pharmacist: [
      "dashboard",
      "patients",
      "medicines",
      "inventory",
      "sales",
      "pos",
      "alerts"
    ],

    cashier: [
      "dashboard",
      "patients",
      "pos"
    ],

    inventory_manager: [
      "dashboard",
      "medicines",
      "inventory"
    ]
  };

  // ================= MASTER MENU =================
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={18} />
    },
    {
      key: "patients",
      label: "Patients",
      path: "/patients",
      icon: <User size={18} />
      },
    
    {
      key: "medicines",
      label: "Medicines",
      path: "/medicines",
      icon: <Pill size={18} />
    },
    {
      key: "inventory",
      label: "Inventory",
      path: "/inventory",
      icon: <Package size={18} />
    },
    {
      key: "sales",
      label: "Sales",
      path: "/sales",
      icon: <FileText size={18} />
    },
    {
      key: "pos",
      label: "POS Sales",
      path: "/pos",
      icon: <ShoppingCart size={18} />
    },
    {
      key: "reports",
      label: "Reports",
      path: "/reports",
      icon: <FileText size={18} />
    },
    {
      key: "alerts",
      label: "Alerts",
      path: "/alerts",
      icon: <Bell size={18} />
    },
    {
      key: "admin",
      label: "Admin Panel",
      path: "/admin",
      icon: <User size={18} />
    },

    {
      key: "logs",
      label: "System Logs",
      path: "/logs",
      icon: <Activity size={18} />
    },
  ];

  // ================= FILTER MENU =================
  const allowedMenus = menuByRole[role] || [];
  const filteredMenu = menuItems.filter(item =>
    allowedMenus.includes(item.key)
  );

  // ================= ALERTS =================
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/alerts");
        const alerts = Array.isArray(res.data) ? res.data : [];

        const high = alerts.filter(a => a?.severity === "high").length;
        setHighAlerts(high);
      } catch {
        setHighAlerts(0);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);

    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition text-sm
    ${isActive(path)
      ? "bg-blue-700 text-white"
      : "text-gray-300 hover:bg-blue-500 hover:text-white"
    }`;

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="p-4 text-gray-500">
        Loading sidebar...
      </div>
    );
  }

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between bg-[#0f172a] text-white p-3">
        <h1 className="font-bold text-blue-400">Pharmacy Dashboard</h1>

        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed md:static top-0 left-0 w-64 h-screen
        bg-[#111c33] text-white flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* HEADER */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-blue-400">
            Pharmacy Dashboard
          </h2>

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
            <ShieldCheck size={14} />
            <span>{role.toUpperCase()}</span>
          </div>
        </div>

        {/* NAV */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">

          {filteredMenu.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => setOpen(false)}
              className={linkClass(item.path)}
            >
              {item.icon}
              {item.label}

              {item.key === "alerts" && highAlerts > 0 && (
                <span className="ml-auto bg-red-500 text-xs px-2 py-0.5 rounded-full">
                  {highAlerts}
                </span>
              )}
            </Link>
          ))}

        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-700 p-3 space-y-2">

          <div className="text-xs text-gray-400">
            Logged in as: <span className="text-white">{userName}</span>
          </div>

          <Link
            to="/settings"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <Settings size={16} />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

      </div>
    </>
  );
}

export default Sidebar;