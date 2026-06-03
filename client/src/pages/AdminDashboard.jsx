import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "pharmacist",
    phone: "",
  });

  /*
  ========================
  FETCH USERS
  ========================
  */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /*
  ========================
  FORM HANDLER
  ========================
  */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /*
  ========================
  CREATE USER
  ========================
  */
  const createUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users", form);

      alert("User created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "pharmacist",
        phone: "",
      });

      fetchUsers();

    } catch (error) {
      alert(error.response?.data?.message || "Error creating user");
    }
  };

  /*
  ========================
  TOGGLE STATUS
  ========================
  */
  const toggleStatus = async (id) => {
    try {
      await api.put(`/users/status/${id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  /*
  ========================
  DELETE USER
  ========================
  */
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="text-white">

      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-400">
          Admin Dashboard
        </h1>
        <p className="text-gray-400">
           Smart Pharmacy User Management System
        </p>
      </div>

      {/* ================= CREATE USER FORM ================= */}
      <div className="bg-[#063292] p-4 rounded mb-6">

        <h2 className="text-lg font-semibold mb-4 text-white-500">
          Create New Staff User
        </h2>

        <form
          onSubmit={createUser}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="p-2 rounded text-white"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 rounded text-white"
            required
          />

          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="p-2 rounded text-white"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-2 rounded text-"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="p-2 rounded text-black"
          >
            <option value="pharmacist">Pharmacist</option>
            <option value="cashier">Cashier</option>
            <option value="inventory_manager">Inventory Manager</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white p-2 rounded"
          >
            Create User
          </button>

        </form>

      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-[#111c33] p-4 rounded">
          <h2 className="text-gray-400">Total Users</h2>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>

        <div className="bg-[#111c33] p-4 rounded">
          <h2 className="text-gray-400">Admins</h2>
          <p className="text-2xl font-bold">
            {users.filter(u => u.role === "admin").length}
          </p>
        </div>

        <div className="bg-[#111c33] p-4 rounded">
          <h2 className="text-gray-400">Pharmacists</h2>
          <p className="text-2xl font-bold">
            {users.filter(u => u.role === "pharmacist").length}
          </p>
        </div>

        <div className="bg-[#111c33] p-4 rounded">
          <h2 className="text-gray-400">Cashiers</h2>
          <p className="text-2xl font-bold">
            {users.filter(u => u.role === "cashier").length}
          </p>
        </div>

      </div>

      {/* ================= USERS TABLE ================= */}
      <div className="bg-[#111c33] p-4 rounded">

        <h2 className="text-lg font-semibold mb-4">
          Staff Management
        </h2>

        {loading ? (
          <p>Loading users...</p>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  <th className="p-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id} className="border-b border-gray-800">

                    <td className="p-2">{user.name}</td>
                    <td>{user.email}</td>

                    {/* ROLE */}
                    <td>
                      <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                        {user.role}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className={
                        user.status === "active"
                          ? "bg-green-600 px-2 py-1 rounded text-xs"
                          : "bg-red-600 px-2 py-1 rounded text-xs"
                      }>
                        {user.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="space-x-2">

                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="bg-yellow-600 px-2 py-1 rounded text-xs"
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-600 px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}

export default AdminDashboard;