import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const data = res.data;

    console.log("LOGIN RESPONSE:", data);

    const token = data.token;
    const role = (data.role || "").toLowerCase().trim();

    if (!token) {
      throw new Error("Login failed: No token received");
    }

    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      role,
      permissions: data.permissions || [],
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    console.log("ROLE DETECTED:", role);

    // 🔥 SAFE NAVIGATION (FIXED)
    switch (role) {
      case "admin":
        navigate("/admin");
        break;

      case "pharmacist":
        navigate("/");
        break;

      case "cashier":
        navigate("/pos");
        break;

      default:
        console.warn("UNKNOWN ROLE:", role);
        navigate("/");
        break;
    }

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    alert(
      error.response?.data?.message ||
      error.message ||
      "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">

        {/* LOGO */}
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="Smart Pharmacy Logo"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow-lg"
          />
        </div>

        {/* TITLE */}
        <div className="text-center mt-4">
          <h1 className="text-3xl font-bold text-blue-700">
            Smart Pharmacy
          </h1>

          <p className="font-medium text-gray-700 mt-1">
            Your Hospital / Pharmacy Name
          </p>

          <p className="text-gray-500 mt-2">
            Inventory • POS • Reports • AI Alerts
          </p>
        </div>

        {/* SECURITY BANNER */}
        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-3">
          <p className="text-center text-sm text-blue-700">
            Secure login for authorized staff only
          </p>
        </div>

        {/* EMAIL */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* REMEMBER + FORGOT */}
        <div className="flex justify-between items-center mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember Me
          </label>

          <button className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login to System"}
        </button>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Smart Pharmacy System
        </p>

      </div>
    </div>
  );
}

export default Login;