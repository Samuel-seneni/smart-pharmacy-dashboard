import { useEffect, useState } from "react";
import api from "../api/axios";
import Modal from "../components/Modal";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewPatient, setViewPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    medicalHistory: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data.patients || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/patients", form);

      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        medicalHistory: "",
      });

      setOpen(false);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating patient");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await api.delete(`/patients/${id}`);
      fetchPatients();
    } catch (err) {
      alert("Error deleting patient");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/patients/${editPatient.id}`, editPatient);
      setEditPatient(null);
      fetchPatients();
    } catch (err) {
      alert("Error updating patient");
    }
  };

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Patient Management (ERP)</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Patient
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full min-w-[800px] border border-gray-200">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-r">ID</th>
              <th className="p-3 border-r">Name</th>
              <th className="p-3 border-r">Age</th>
              <th className="p-3 border-r">Gender</th>
              <th className="p-3 border-r">Phone</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p, index) => (
              <tr
                key={p.id}
                className={
                  index % 2 === 0
                    ? "bg-white hover:bg-blue-50"
                    : "bg-gray-50 hover:bg-blue-50"
                }
              >

                <td className="p-3 border-r">{p.id}</td>
                <td className="p-3 border-r font-medium">{p.name}</td>
                <td className="p-3 border-r">{p.age}</td>
                <td className="p-3 border-r">{p.gender}</td>
                <td className="p-3 border-r">{p.phone}</td>

                {/* ACTIONS */}
                <td className="p-3">
                  <div className="flex flex-wrap gap-2 justify-center">

                    <button
                      onClick={() => setViewPatient(p)}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => setEditPatient(p)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
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

      {/* ================= ADD MODAL ================= */}
      {open && (
        <Modal title="Add Patient" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-2">

            <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
            <Input name="age" value={form.age} onChange={handleChange} placeholder="Age" type="number" />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />

            <textarea
              name="medicalHistory"
              value={form.medicalHistory}
              onChange={handleChange}
              placeholder="Medical History"
              className="w-full border p-2"
            />

            <button className="w-full bg-blue-600 text-white p-2 rounded">
              Save Patient
            </button>

          </form>
        </Modal>
      )}

      {/* ================= VIEW MODAL ================= */}
      {viewPatient && (
        <Modal title="Patient Details" onClose={() => setViewPatient(null)}>
          <div className="space-y-2">
            <p><b>Name:</b> {viewPatient.name}</p>
            <p><b>Age:</b> {viewPatient.age}</p>
            <p><b>Gender:</b> {viewPatient.gender}</p>
            <p><b>Phone:</b> {viewPatient.phone}</p>
            <p><b>History:</b> {viewPatient.medicalHistory}</p>
          </div>
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editPatient && (
        <Modal title="Edit Patient" onClose={() => setEditPatient(null)}>
          <form onSubmit={handleUpdate} className="space-y-2">

            <Input
              name="name"
              value={editPatient.name}
              onChange={(e) =>
                setEditPatient({ ...editPatient, name: e.target.value })
              }
            />

            <Input
              name="age"
              value={editPatient.age}
              onChange={(e) =>
                setEditPatient({ ...editPatient, age: e.target.value })
              }
            />

            <Input
              name="phone"
              value={editPatient.phone}
              onChange={(e) =>
                setEditPatient({ ...editPatient, phone: e.target.value })
              }
            />

            <button className="w-full bg-green-600 text-white p-2 rounded">
              Update Patient
            </button>

          </form>
        </Modal>
      )}

    </div>
  );
}

/* ================= INPUT ================= */
function Input(props) {
  return <input {...props} className="w-full border p-2" />;
}

export default Patients;