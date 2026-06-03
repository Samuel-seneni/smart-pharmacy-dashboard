import { useEffect, useState } from "react";
import api from "../api/axios";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await api.get("/logs");

      setLogs(res.data.logs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    const interval = setInterval(fetchLogs, 10000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    return (
      log.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.role?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          System Activity Logs
        </h1>

        <p className="text-gray-500">
          Audit trail of all user actions
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-gray-500">Total Logs</h3>
          <p className="text-2xl font-bold">
            {logs.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-gray-500">Logins</h3>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter(l => l.action === "LOGIN").length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-gray-500">Admins</h3>
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter(l => l.role === "admin").length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-gray-500">Today's Logs</h3>
          <p className="text-2xl font-bold text-purple-600">
            {
              logs.filter(log => {
                const today = new Date().toDateString();
                return (
                  new Date(log.createdAt).toDateString() === today
                );
              }).length
            }
          </p>
        </div>

      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search logs..."
          className="border rounded-lg p-2 w-full md:w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (
          <div className="p-6">
            Loading logs...
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Action</th>
                  <th className="text-left p-3">Route</th>
                  <th className="text-left p-3">IP</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>

              <tbody>

                {filteredLogs.map((log) => (

                  <tr
                    key={log.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {log.name}
                    </td>

                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {log.role}
                      </span>
                    </td>

                    <td className="p-3">
                      {log.action}
                    </td>

                    <td className="p-3">
                      {log.route}
                    </td>

                    <td className="p-3">
                      {log.ipAddress}
                    </td>

                    <td className="p-3">
                      {new Date(log.createdAt).toLocaleString()}
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

export default ActivityLogs;