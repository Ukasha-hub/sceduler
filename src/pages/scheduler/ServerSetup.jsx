import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_API_URL}/api/v1/server/servers/`;

const ServerSetup = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    rowId: null,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const tableRef = useRef();

  // ----------- Fetch data (GET) -----------
  const fetchServers = async () => {
    try {
      const res = await axios.get(API);
      setTableData(res.data);
    } catch (err) {
      console.error("GET Error:", err);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  // ----------- Hide context menu -----------
  useEffect(() => {
    const handleClick = () =>
      setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  // Select all
  const handleSelectAll = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map((row) => row.id));
    }
  };

  // Row selection
  const handleRowClick = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Right-click context menu
  const handleRightClick = (e, rowId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      rowId,
    });
  

    if (!selectedRows.includes(rowId)) setSelectedRows([rowId]);
  };

  // ---------------- DELETE API ----------------
  const handleDeleteRows = async () => {
    try {
      for (const id of selectedRows) {
        await axios.delete(API + id);
      }

      await fetchServers(); // refresh table
      setSelectedRows([]);
      setContextMenu({ ...contextMenu, visible: false });
      alert("Deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ---------------- EDIT + SAVE ----------------

  const [formData, setFormData] = useState({
    server: "",
    ip1: "",
    ip2: "",
  });

  const [editId, setEditId] = useState(null);

  // Fill form on edit click
  const handleEdit = (id) => {
    const row = tableData.find((r) => r.id === id);
    if (!row) return;

    setEditId(id);
    setFormData({
      server: row.server,
      ip1: row.ip1,
      ip2: row.ip2,
    });

    setContextMenu({ ...contextMenu, visible: false });
  };

  // SAVE = POST, UPDATE = PUT
  const handleSave = async () => {
    if (!formData.server || !formData.ip1 || !formData.ip2) {
      alert("All fields required!");
      return;
    }

    try {
      if (editId) {
        await axios.put(API + editId, {
          server: formData.server,
          ip1: formData.ip1,
          ip2: formData.ip2,
        });
      } else {
        await axios.post(API, {
          server: formData.server,
          ip1: formData.ip1,
          ip2: formData.ip2,
        });
      }

      await fetchServers();

      setEditId(null);
      setFormData({ server: "", ip1: "", ip2: "" });
    } catch (err) {
      console.error("Save/Update Error:", err);
    }
  };

  const handleReset = () => {
    setEditId(null);
    setFormData({ server: "", ip1: "", ip2: "" });
  };

  return (
    <div className="flex lg:flex-row flex-col mt-2 text-xs gap-4">
      {/* ===================== TABLE ===================== */}
      <div className="w-full lg:w-2/3 overflow-x-auto" ref={tableRef}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Server Table</h3>
          </div>

          <div className="table-responsive relative">
            <table className="table table-collapse table-hover min-w-[600px]">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === tableData.length &&
                        tableData.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="border-b p-2 text-left">Server</th>
                  <th className="border-b p-2 text-left">IP 1</th>
                  <th className="border-b p-2 text-left">IP 2</th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((row) => (
                  <tr
                    key={row.id}
                    className={`cursor-pointer hover:bg-gray-100 ${
                      selectedRows.includes(row.id) ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleRowClick(row.id)}
                    onContextMenu={(e) => handleRightClick(e, row.id)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowClick(row.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="border-t p-2">{row.server}</td>
                    <td className="border-t p-2">{row.ip1}</td>
                    <td className="border-t p-2">{row.ip2}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ================= CONTEXT MENU ================= */}
            {contextMenu.visible && (
              <div
                style={{
                  position: "fixed",
                  top: contextMenu.y,
                  left: contextMenu.x,
                  background: "white",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                  zIndex: 2000,
                }}
              >
                <ul className="p-1 m-0 list-none">
                  <li
                    className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleEdit(contextMenu.rowId)}
                  >
                    Edit
                  </li>

                  <li
                    className="px-4 py-1 hover:bg-red-100 cursor-pointer text-red-600"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== FORM ===================== */}
      <div className="card card-primary w-full lg:w-1/3 self-start">
        <div className="card-header">
          <h3 className="card-title text-white">Server Setup</h3>
        </div>

        <form>
          <div className="card-body">
            {/* Server */}
            <div className="mb-4 relative">
              <input
                type="text"
                value={formData.server}
                onChange={(e) =>
                  setFormData({ ...formData, server: e.target.value })
                }
                placeholder=" "
                className="peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-8 focus:border-blue-500 focus:outline-none"
              />
              <label className="absolute left-2 top-2 bg-white px-1 text-gray-500 transition-all peer-focus:-translate-y-3 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-2 peer-focus:text-blue-500">
                Server
              </label>
            </div>

            {/* IP 1 */}
            <div className="mb-4 relative">
              <input
                type="text"
                value={formData.ip1}
                onChange={(e) =>
                  setFormData({ ...formData, ip1: e.target.value })
                }
                placeholder=" "
                className="peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-8 focus:border-blue-500 focus:outline-none"
              />
              <label className="absolute left-2 top-2 bg-white px-1 text-gray-500 transition-all peer-focus:-translate-y-3 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-2 peer-focus:text-blue-500">
                IP 1
              </label>
            </div>

            {/* IP 2 */}
            <div className="mb-4 relative">
              <input
                type="text"
                value={formData.ip2}
                onChange={(e) =>
                  setFormData({ ...formData, ip2: e.target.value })
                }
                placeholder=" "
                className="peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-8 focus:border-blue-500 focus:outline-none"
              />
              <label className="absolute left-2 top-2 bg-white px-1 text-gray-500 transition-all peer-focus:-translate-y-3 peer-focus:scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-2 peer-focus:text-blue-500">
                IP 2
              </label>
            </div>
          </div>

          <div className="card-footer flex flex-row justify-between gap-3">
            <button
              type="button"
              className="h-7 border-2 rounded-md border-blue-400 btn-outline-primary flex-1"
              onClick={handleSave}
            >
              {editId ? "Update" : "Save"}
            </button>
            {/* RESET BUTTON – only visible when editing */}
  {editId && (
    <button
      type="button"
      className="h-7 border-2 rounded-md border-gray-400 btn-outline-secondary flex-1"
      onClick={handleReset}
    >
      Reset
    </button>
  )}
          </div>
        </form>
      </div>
      {/* ==================== DELETE CONFIRM MODAL ==================== */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-md w-80 shadow-lg">
      <h2 className="text-sm font-semibold mb-2">Are you sure?</h2>

      <p className="text-xs mb-2">You are about to delete:</p>

      {/* List of selected servers */}
      <ul className="text-xs mb-3 bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
        {tableData
          .filter((row) => selectedRows.includes(row.id))
          .map((row) => (
            <li key={row.id} className="py-1 border-b last:border-none">
              {row.server} ({row.ip1} / {row.ip2})
            </li>
          ))}
      </ul>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-3 py-1 border rounded text-xs"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await handleDeleteRows();
            setShowDeleteModal(false);
          }}
          className="px-3 py-1 bg-red-600 text-white rounded text-xs"
        >
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ServerSetup;
