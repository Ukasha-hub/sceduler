import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://172.16.9.132:8080/api/v1/history/";

const HistoryLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch History Logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(API_URL);
        setLogs(res.data || []);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">History Logs</h2>

      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">ID</th>
                <th className="px-4 py-2 text-left border">Emp ID</th>
                <th className="px-4 py-2 text-left border">Action</th>
                <th className="px-4 py-2 text-left border">Action Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{log.id}</td>
                  <td className="px-4 py-2 border">{log.emp_id}</td>
                  <td className="px-4 py-2 border break-words max-w-xs">
                    {log.action}
                  </td>
                  <td className="px-4 py-2 border">
                    {formatDate(log.action_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryLog;
