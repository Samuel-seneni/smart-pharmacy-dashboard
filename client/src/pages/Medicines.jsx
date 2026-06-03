import { useEffect, useState } from "react";
import api from "../api/axios";
import Modal from "../components/Modal";

function Medicines() {
  // ALWAYS keep array safe
  const [medicines, setMedicines] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  // -----------------------------
  // SAFE API LOADER (FIXES ERROR)
  // -----------------------------
  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/medicines");

      console.log("API RESPONSE:", res.data);

      // FIX: normalize response into array
      const data =
        res.data?.data ||
        res.data?.medicines ||
        res.data ||
        [];

      if (Array.isArray(data)) {
        setMedicines(data);
      } else {
        setMedicines([]);
        setError("Invalid data format from server");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load medicines");
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // FORM HANDLER
  // -----------------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", quantity: "", price: "" });
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item?.name || "",
      quantity: item?.quantity || "",
      price: item?.price || "",
    });
    setOpen(true);
  };

  // -----------------------------
  // SAVE (CREATE / UPDATE)
  // -----------------------------
  const saveMedicine = async () => {
    try {
      if (!form.name) return alert("Name required");

      if (editing) {
        await api.put(`/medicines/${editing.id}`, form);
      } else {
        await api.post("/medicines", form);
      }

      setOpen(false);
      loadMedicines();
    } catch (err) {
      console.error(err);
      alert("Failed to save medicine");
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const deleteMedicine = async (id) => {
    try {
      if (!confirm("Delete this medicine?")) return;

      await api.delete(`/medicines/${id}`);
      loadMedicines();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          Medicines
        </h1>

        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Medicine
        </button>
      </div>

      {/* LOADING / ERROR */}
      {loading && (
        <p className="text-gray-500">Loading medicines...</p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {/* TABLE WRAPPER (RESPONSIVE FIX) */}
      <div className="overflow-x-auto bg-white shadow rounded">

        <table className="min-w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {/* SAFE MAP (CRASH FIX) */}
            {Array.isArray(medicines) &&
              medicines.map((m, index) => (
                <tr key={m.id || index} className="border-t">

                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.quantity}</td>
                  <td className="p-3">KES {m.price}</td>

                  <td className="p-3">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">

                      <button
                        onClick={() => openEdit(m)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteMedicine(m.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

          </tbody>

        </table>
      </div>

      {/* EMPTY STATE */}
      {!loading && medicines.length === 0 && !error && (
        <p className="text-gray-500 mt-4">
          No medicines found
        </p>
      )}

      {/* MODAL */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Medicine" : "Add Medicine"}
      >

        <div className="space-y-3">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-2 rounded"
          />

          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full border p-2 rounded"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-2 rounded"
          />

          <button
            onClick={saveMedicine}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Save
          </button>

        </div>

      </Modal>

    </div>
  );
}

export default Medicines;