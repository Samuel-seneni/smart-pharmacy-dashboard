import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/sales");

      let data = [];

      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.data)) data = res.data.data;
      else if (Array.isArray(res.data.sales)) data = res.data.sales;
      else if (Array.isArray(res.data.result)) data = res.data.result;

      setSales(data);
    } catch (err) {
      setError("Failed to load sales data");
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTERING ----------------
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        (s.customerName || "walk-in")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (s.medicineName || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesPayment =
        paymentFilter === "All"
          ? true
          : s.paymentMethod === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [sales, search, paymentFilter]);

  // ---------------- SUMMARY ----------------
  const totalRevenue = useMemo(() => {
    return filteredSales.reduce(
      (sum, s) => sum + Number(s.totalPrice || 0),
      0
    );
  }, [filteredSales]);

  const totalTransactions = filteredSales.length;

  // ---------------- EXPORT CSV ----------------
  const exportCSV = () => {
    const headers = [
      "Invoice",
      "Customer",
      "Medicine",
      "Qty",
      "Total",
      "Payment",
      "Date",
    ];

    const rows = filteredSales.map((s) => [
      s.id,
      s.customerName || "Walk-in",
      s.medicineName || s.medicine?.name || "N/A",
      s.quantity,
      s.totalPrice,
      s.paymentMethod,
      s.createdAt
        ? new Date(s.createdAt).toLocaleString()
        : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    a.click();
  };

  // ---------------- PRINT ----------------
  const printInvoice = (sale) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Invoice #${sale.id}</title>
        </head>
        <body>
          <h2>Hospital Pharmacy Invoice</h2>
          <p><b>Invoice:</b> #${sale.id}</p>
          <p><b>Customer:</b> ${sale.customerName || "Walk-in"}</p>
          <p><b>Medicine:</b> ${
            sale.medicineName || sale.medicine?.name
          }</p>
          <p><b>Qty:</b> ${sale.quantity}</p>
          <p><b>Total:</b> KES ${sale.totalPrice}</p>
          <p><b>Payment:</b> ${sale.paymentMethod}</p>
          <p><b>Date:</b> ${
            sale.createdAt
              ? new Date(sale.createdAt).toLocaleString()
              : ""
          }</p>
        </body>
      </html>
    `);

    win.print();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">

        <h1 className="text-xl font-bold">
          Smart Pharmacy Billing System (Production)
        </h1>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Export CSV
          </button>
        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">
            Transactions
          </p>
          <p className="text-xl font-bold">
            {totalTransactions}
          </p>
        </div>

        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">
            Revenue
          </p>
          <p className="text-xl font-bold text-green-600">
            KES {totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">
            Status
          </p>
          <p className="text-xl font-bold">
            {loading ? "Loading..." : "Active"}
          </p>
        </div>

      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">

        <input
          type="text"
          placeholder="Search customer or medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={paymentFilter}
          onChange={(e) =>
            setPaymentFilter(e.target.value)
          }
          className="border p-2 rounded"
        >
          <option value="All">All Payments</option>
          <option>Cash</option>
          <option>Card</option>
          <option>Mobile Money</option>
          <option>Insurance</option>
        </select>

      </div>

      {/* TABLE */}
      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">

          <table className="w-full border text-sm">

            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Invoice</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Medicine</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Payment</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale, index) => (
                <tr
                  key={sale.id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }
                >

                  <td className="border p-2 font-bold">
                    #{sale.id}
                  </td>

                  <td className="border p-2">
                    {sale.customerName || "Walk-in"}
                  </td>

                  <td className="border p-2">
                    {sale.medicineName ||
                      sale.medicine?.name ||
                      "N/A"}
                  </td>

                  <td className="border p-2 text-center">
                    {sale.quantity}
                  </td>

                  <td className="border p-2 text-green-600 font-bold">
                    KES {sale.totalPrice}
                  </td>

                  <td className="border p-2">
                    {sale.paymentMethod}
                  </td>

                  <td className="border p-2 text-xs">
                    {sale.createdAt
                      ? new Date(
                          sale.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() =>
                        printInvoice(sale)
                      }
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Print
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Sales;