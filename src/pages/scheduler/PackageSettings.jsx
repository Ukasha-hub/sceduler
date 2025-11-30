import React, { useEffect, useState } from "react";

const PackageSettings = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackageName, setSelectedPackageName] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Load packages from localStorage
  useEffect(() => {
    const storedPackages = JSON.parse(localStorage.getItem("razuna_packages") || "[]");
    setPackages(storedPackages);
  }, []);

  // Update rows when package changes
  useEffect(() => {
    const pkg = packages.find((p) => p.name === selectedPackageName);
    setRows(pkg ? pkg.items : []);
    setSelectedRows([]);
  }, [selectedPackageName, packages]);

  // Delete a single row
  const handleDeleteRow = (rowId) => {
    const pkgIndex = packages.findIndex((p) => p.name === selectedPackageName);
    if (pkgIndex === -1) return;

    const updatedItems = packages[pkgIndex].items.filter((item) => item.id !== rowId);
    const updatedPackages = [...packages];
    updatedPackages[pkgIndex].items = updatedItems;

    setPackages(updatedPackages);
    setRows(updatedItems);
    localStorage.setItem("razuna_packages", JSON.stringify(updatedPackages));
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
      <div className="mb-4">
        <select
          className="border px-2 py-1 rounded w-full max-w-xs"
          value={selectedPackageName}
          onChange={(e) => setSelectedPackageName(e.target.value)}
        >
          <option value="">-- Select Package --</option>
          {packages.map((pkg) => (
            <option key={pkg.name} value={pkg.name}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-collapse table-hover min-w-[600px]">
          <thead>
            <tr>
              
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">ID</th>
              <th className="border-b p-2 text-left">Duration</th>
              <th className="border-b p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
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
