import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

function SalesPOS() {
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [patientId, setPatientId] = useState("");

  // ================= LOAD DATA =================
  useEffect(() => {
    loadMedicines();
    loadPatients();
  }, []);

  // ================= LOAD MEDICINES =================
  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/medicines");

      const data =
        res.data?.medicines ||
        res.data?.data ||
        res.data ||
        [];

      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load medicines");
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD PATIENTS =================
  const loadPatients = async () => {
    try {
      const res = await api.get("/patients");

      setPatients(res.data?.patients || []);
    } catch (err) {
      console.log("Failed to load patients", err);
      setPatients([]);
    }
  };

  // ================= FILTER =================
  const filteredMedicines = medicines.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= CART FUNCTIONS =================
  const addToCart = (medicine) => {
    const existing = cart.find((item) => item.id === medicine.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    const quantity = Math.max(1, Number(qty));

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getCartQty = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  // ================= TOTAL =================
  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
        Number(item.quantity || 0),
      0
    );
  }, [cart]);

  // ================= COMPLETE SALE =================
  const completeSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      for (const item of cart) {
        await api.post("/sales", {
          medicineId: item.id,
          quantity: item.quantity,
          paymentMethod,
          customerName,
          patientId: patientId || null,
        });
      }

      alert("Sale completed successfully");

      setCart([]);
      setCustomerName("");
      setPaymentMethod("Cash");
      setPatientId("");

      loadMedicines();
    } catch (error) {
      console.log(error);
      alert("Sale failed");
    }
  };

  // ================= UI =================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

      {/* ================= LEFT PANEL ================= */}
      <div className="lg:col-span-8">
        <div className="bg-white rounded-lg shadow p-4">

          <h2 className="text-xl font-bold mb-4">
            Pharmacy POS System
          </h2>

          <input
            className="w-full border rounded p-2 mb-4"
            placeholder="Search medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* TABLE */}
          {!loading && !error && (
            <div className="rounded-lg overflow-hidden border">

              <div className="grid grid-cols-5 bg-gray-100 font-semibold p-3">
                <div>Medicine</div>
                <div className="text-center">Stock</div>
                <div className="text-center">Price</div>
                <div className="text-center">Status</div>
                <div className="text-right">Action</div>
              </div>

              {filteredMedicines.map((medicine) => {
                const qty = getCartQty(medicine.id);
                const lowStock = medicine.quantity <= 10;

                return (
                  <div
                    key={medicine.id}
                    className="grid grid-cols-5 p-3 border-b"
                  >
                    <div>{medicine.name}</div>

                    <div className="text-center">
                      {medicine.quantity}
                    </div>

                    <div className="text-center text-green-600 font-bold">
                      KES {medicine.price}
                    </div>

                    <div className="text-center">
                      {lowStock ? (
                        <span className="text-red-600 text-xs">Low</span>
                      ) : (
                        <span className="text-green-600 text-xs">OK</span>
                      )}
                    </div>

                    <div className="flex justify-end items-center gap-2">

                      <button
                        onClick={() => {
                          const item = cart.find(i => i.id === medicine.id);
                          if (!item) return;

                          if (item.quantity === 1) {
                            removeItem(medicine.id);
                          } else {
                            updateQty(medicine.id, item.quantity - 1);
                          }
                        }}
                        className="bg-red-500 text-white w-8 h-8 rounded"
                      >
                        −
                      </button>

                      <span>{qty}</span>

                      <button
                        disabled={medicine.quantity <= qty}
                        onClick={() => addToCart(medicine)}
                        className="bg-blue-600 text-white w-8 h-8 rounded"
                      >
                        +
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="lg:col-span-4">
        <div className="bg-white p-4 rounded shadow">

          <h2 className="font-bold mb-3">Cart</h2>

          {/* PATIENT SELECT */}
          <select
            className="w-full border p-2 mb-2"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            <option value="">Walk-in Customer</option>

            {(patients || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.phone})
              </option>
            ))}
          </select>

          {/* CUSTOMER NAME */}
          <input
            className="w-full border p-2 mb-2"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          {/* PAYMENT */}
          <select
            className="w-full border p-2 mb-2"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option>Cash</option>
            <option>Card</option>
            <option>Mobile Money</option>
            <option>Insurance</option>
          </select>

          {/* CART ITEMS */}
          {cart.map((item) => (
            <div key={item.id} className="border-b py-2">
              <div className="flex justify-between">
                <span>{item.name}</span>

                <button
                  className="text-red-500"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQty(item.id, e.target.value)}
                className="border w-full p-1 mt-2"
              />
            </div>
          ))}

          {/* TOTAL */}
          <div className="font-bold text-lg mt-3">
            Total: KES {total.toFixed(2)}
          </div>

          {/* CHECKOUT */}
          <button
            onClick={completeSale}
            className="w-full bg-green-600 text-white py-2 mt-3 rounded"
          >
            Complete Sale
          </button>

        </div>
      </div>

    </div>
  );
}

export default SalesPOS;