import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://172.16.9.132:8080/api/v1/package/";

const PackageSettings = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackageName, setSelectedPackageName] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Load packages from API
  const fetchPackages = async () => {
    try {
      const res = await axios.get(API_URL);
      setPackages(res.data);
    } catch (err) {
      console.error("Failed to fetch packages", err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Update rows when package changes
  useEffect(() => {
    const pkg = packages.find((p) => p.name === selectedPackageName);
    setRows(pkg ? pkg.items : []);
    setSelectedRows([]);
  }, [selectedPackageName, packages]);

  // Delete a single row via PATCH API
  const handleDeleteRow = async (rowId) => {
    const pkg = packages.find((p) => p.name === selectedPackageName);
    if (!pkg) return;
  
    try {
      const res = await axios.delete(`${API_URL}${pkg.id}/item/${rowId}`);
  
      // Update UI with response
      setRows(res.data.items);
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? res.data : p))
      );
    } catch (err) {
      console.error("Failed to delete item", err);
      alert("Failed to delete item");
    }
  };

  const handleDeletePackage = async () => {
    const pkg = packages.find((p) => p.name === selectedPackageName);
    if (!pkg) return;
  
    if (!window.confirm("Are you sure you want to delete this package?")) return;
  
    try {
      await axios.delete(`${API_URL}${pkg.id}`);
  
      // Remove from UI
      const remaining = packages.filter((p) => p.id !== pkg.id);
      setPackages(remaining);
  
      // Reset current selection
      setSelectedPackageName("");
      setRows([]);
  
      alert("Package deleted successfully!");
    } catch (err) {
      console.error("Failed to delete package", err);
      alert("Failed to delete package");
    }
  };
  
  

  // Select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((r) => r.id));
    }
  };

  // Toggle single row
  const handleRowClick = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Package Settings</h2>

      {/* Package dropdown */}
      <div className="relative w-full max-w-xs mb-4">
        <select
          className="border rounded px-2 pt-2 w-full h-8 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedPackageName}
          onChange={(e) => setSelectedPackageName(e.target.value)}
        >
          <option value="" disabled>
            -- Select Package --
          </option>
          {packages.map((pkg) => (
            <option key={pkg.name} value={pkg.name}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPackageName && (
  <button
    className="px-3 py-1 bg-red-600 text-white text-xs rounded mb-3"
    onClick={handleDeletePackage}
  >
    Delete Package
  </button>
)}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-collapse text-xs table-hover min-w-[600px]">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.length === rows.length && rows.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">ID</th>
              <th className="border-b p-2 text-left">Duration</th>
              <th className="border-b p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-2 text-gray-500">
                  No rows
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={`cursor-pointer hover:bg-gray-100 ${
                    selectedRows.includes(row.id) ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleRowClick(row.id)}
                >
                  <td className="border-t p-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowClick(row.id)}
                    />
                  </td>
                  <td className="border-t p-2">{row.name}</td>
                  <td className="border-t p-2">{row.id}</td>
                  <td className="border-t p-2">{row.duration}</td>
                  <td className="border-t p-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRow(row.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageSettings;
