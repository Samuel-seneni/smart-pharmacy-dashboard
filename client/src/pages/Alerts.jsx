import { useEffect, useState } from "react";
import api from "../api/axios";

function Alerts() {

  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");

  /*
  ========================
  LOAD ALERTS
  ========================
  */
  const loadAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    loadAlerts();

    const interval = setInterval(() => {
      loadAlerts();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  /*
  ========================
  MARK AS READ
  ========================
  */
  const markAsRead = async (id) => {
    try {
      await api.put(`/alerts/${id}`);
      loadAlerts();
    } catch (error) {
      console.log(error);
    }
  };

  /*
  ========================
  FILTER ALERTS
  ========================
  */
  const filteredAlerts =
    filter === "all"
      ? alerts
      : alerts.filter(a => a.severity === filter);

  /*
  ========================
  UI COLOR SYSTEM
  ========================
  */
  const getStyles = (severity) => {
    switch (severity) {
      case "high":
        return {
          border: "border-red-500",
          bg: "bg-red-50",
          text: "text-red-700",
          badge: "bg-red-600"
        };

      case "medium":
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          badge: "bg-yellow-600"
        };

      default:
        return {
          border: "border-green-500",
          bg: "bg-green-50",
          text: "text-green-700",
          badge: "bg-green-600"
        };
    }
  };

  return (

    <div className="p-4">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-blue-400">
          Real-Time Alerts Center
        </h1>
        <p className="text-gray-500">
          AI-powered pharmacy monitoring system
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-4 flex-wrap">

        {["all", "high", "medium", "low"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded text-sm ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}

      </div>

      {/* ALERT LIST */}
      <div className="space-y-3">

        {filteredAlerts.length === 0 ? (
          <p className="text-gray-500">
            No alerts found
          </p>
        ) : (

          filteredAlerts.map(alert => {

            const style = getStyles(alert.severity);

            return (

              <div
                key={alert.id}
                className={`p-4 rounded border-l-4 shadow-sm flex flex-col md:flex-row md:justify-between ${style.bg} ${style.border}`}
              >

                {/* LEFT CONTENT */}
                <div>

                  <div className="flex items-center gap-2">

                    <h3 className={`font-bold ${style.text}`}>
                      {alert.type}
                    </h3>

                    <span className={`text-white text-xs px-2 py-1 rounded ${style.badge}`}>
                      {alert.severity}
                    </span>

                  </div>

                  <p className="text-sm mt-1 text-gray-700">
                    {alert.message}
                  </p>

                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-3 mt-3 md:mt-0">

                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.status === "unread"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}>
                    {alert.status}
                  </span>

                  {alert.status === "unread" && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-500"
                    >
                      Mark Read
                    </button>
                  )}

                </div>

              </div>

            );

          })

        )}

      </div>

    </div>

  );

}

export default Alerts;