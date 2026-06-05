import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  FileText,
  Download,
  Package,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Brain
} from "lucide-react";

function Reports() {

  const baseURL =
  import.meta.env.VITE_API_URL + "/api/reports/pdf";

  // FILTER STATE
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // DATA STATE
  const [summary, setSummary] = useState({
    sales: 0,
    inventory: 0,
    lowStock: 0,
    revenue: 0
  });

  const [loading, setLoading] = useState(false);

  // ---------------- FIXED FILTER LOGIC ----------------
  const loadSummary = async (from = fromDate, to = toDate) => {
    try {
      setLoading(true);

      const res = await api.get("/reports/summary", {
        params: {
          from: from || undefined,
          to: to || undefined
        }
      });

      setSummary(res.data || {
        sales: 0,
        inventory: 0,
        lowStock: 0,
        revenue: 0
      });

    } catch (err) {
      console.error("Summary error:", err);
    } finally {
      setLoading(false);
    }
  };

  // AUTO LOAD ON DATE CHANGE (FIXED FILTER ISSUE)
  useEffect(() => {
    loadSummary();
  }, [fromDate, toDate]);

  const buildURL = (type) => {
    let url = `${baseURL}/${type}`;

    if (fromDate && toDate) {
      url += `?from=${fromDate}&to=${toDate}`;
    }

    return url;
  };

  // ---------------- AI INSIGHTS (RULE-BASED SIMULATION) ----------------
  const aiInsight = () => {
    if (summary.lowStock > 10) {
      return "⚠ AI Alert: High number of low stock items. Restocking required immediately.";
    }

    if (summary.revenue < 5000) {
      return "📉 AI Insight: Revenue is below expected threshold. Consider promotional campaigns.";
    }

    if (summary.sales > 100) {
      return "📈 AI Insight: Sales performance is strong. Maintain inventory levels.";
    }

    return "🧠 AI Insight: System is stable. No critical issues detected.";
  };

  return (
    <div className="space-y-6 p-3">

      {/* HEADER */}
      <div className="bg-white p-4 rounded shadow flex items-center gap-3">
        <Brain className="text-purple-600" size={28} />

        <div>
          <h1 className="text-2xl font-bold">
            ERP v4 AI Analytics Reports
          </h1>
          <p className="text-gray-500 text-sm">
            Intelligent hospital reporting & predictive insights
          </p>
        </div>
      </div>

      {/* FILTER SECTION (FIXED) */}
      <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label className="text-sm text-gray-600">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => loadSummary()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center justify-center gap-2"
          >
            <Calendar size={16} />
            Apply Filter
          </button>
        </div>

      </div>

      {/* AI INSIGHT PANEL */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded shadow border">
        <h2 className="font-bold flex items-center gap-2 mb-2">
          <Brain className="text-purple-600" />
          AI Insight Engine
        </h2>

        <p className="text-gray-700">
          {aiInsight()}
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-green-100 p-4 rounded shadow flex items-center gap-3">
          <TrendingUp className="text-green-700" />
          <div>
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-xl font-bold">KES {summary.revenue}</p>
          </div>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow flex items-center gap-3">
          <FileText className="text-blue-700" />
          <div>
            <p className="text-sm text-gray-600">Sales</p>
            <p className="text-xl font-bold">{summary.sales}</p>
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow flex items-center gap-3">
          <Package className="text-yellow-700" />
          <div>
            <p className="text-sm text-gray-600">Inventory</p>
            <p className="text-xl font-bold">{summary.inventory}</p>
          </div>
        </div>

        <div className="bg-red-100 p-4 rounded shadow flex items-center gap-3">
          <AlertTriangle className="text-red-700" />
          <div>
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-xl font-bold">{summary.lowStock}</p>
          </div>
        </div>

      </div>

      {/* REPORT EXPORT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* SALES */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Sales Report</h2>

          <a
            href={buildURL("sales")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded"
          >
            <Download size={16} />
            Download PDF
          </a>
        </div>

        {/* INVENTORY */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Inventory Report</h2>

          <a
            href={buildURL("inventory")}
            className="flex items-center justify-center gap-2 bg-green-600 text-white p-2 rounded"
          >
            <Download size={16} />
            Download PDF
          </a>
        </div>

        {/* LOW STOCK */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Low Stock Report</h2>

          <a
            href={buildURL("low-stock")}
            className="flex items-center justify-center gap-2 bg-red-600 text-white p-2 rounded"
          >
            <Download size={16} />
            Download PDF
          </a>
        </div>

      </div>

    </div>
  );
}

export default Reports;

