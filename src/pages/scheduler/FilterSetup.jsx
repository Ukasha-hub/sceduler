import React, { useEffect, useRef, useState } from 'react'
import axios from "axios";



 

const FilterSetup = () => {
    const [tableData, setTableData] = useState([]);
      const [selectedRows, setSelectedRows] = useState([]);
      const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowId: null });
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [type, setType] = useState("");
const [color, setColor] = useState("#000000");

const [editId, setEditId] = useState(null);
    
      const tableRef = useRef();

      const api = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        headers: { "Content-Type": "application/json" },
      });

      //console.log("API URL:", process.env.REACT_APP_API_URL);
    
      // Hide context menu on click outside
      useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
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
    
      // Row click selection
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
      
        const tableRect = tableRef.current.getBoundingClientRect();
        const x = e.clientX - tableRect.left; // relative X
        const y = e.clientY - tableRect.top;  // relative Y
      
        setContextMenu({ visible: true, x, y, rowId });
      
        if (!selectedRows.includes(rowId)) setSelectedRows([rowId]);
      };
    
      // Delete selected rows
      const handleDeleteRows = () => {
        if (selectedRows.length === 0) return;
        setShowDeleteModal(true);
      };

      const confirmDelete = async () => {
        try {
          await Promise.all(selectedRows.map((id) => api.delete(`/api/v1/filters/${id}`)));
          setSelectedRows([]);
          loadTableData();
        } catch (err) {
          console.error(err);
        }
        setShowDeleteModal(false);
      };

      const loadTableData = async () => {
        try {
          const { data } = await api.get("/api/v1/filters");
          setTableData(data);
        } catch (err) {
          console.error(err);
        }
      };
      useEffect(() => {
        loadTableData();
      }, []);

      const handleSave = async () => {
        if (!type) return alert("Type is required");
        try {
          await api.post("/api/v1/filters", { type, color });
          setType("");
          setColor("#000000");
          loadTableData();
        } catch (err) {
          console.error(err);
          alert("Error saving filter");
        }
      };

      const handleEditFromContext = () => {
        if (!contextMenu.rowId) return;
      
        const row = tableData.find((r) => r.id === contextMenu.rowId);
        if (!row) return;
      
        setEditId(row.id);
        setType(row.type);
        setColor(row.color);
      
        setContextMenu({ ...contextMenu, visible: false });
      };
      
      const handleUpdate = async () => {
        if (!editId) return alert("No row selected for edit!");
      
        try {
          await api.put(`/api/v1/filters/${editId}`, { type, color });
          setEditId(null);
          setType("");
          setColor("#000000");
          loadTableData();
          alert("Updated successfully");
        } catch (err) {
          console.error(err);
          alert("Error updating filter");
        }
      };

      const handleResetEdit = () => {
        setEditId(null);
        setType("");
        setColor("#000000");
      };

      
  return (
    <div className="flex lg:flex-row flex-col mt-2 text-xs gap-4">
        <div className="w-full lg:w-2/3 overflow-x-auto" ref={tableRef}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">DataTable with multiple select</h3>
          </div>

          <div className="table-responsive">
            <table className="table table-collapse table-hover min-w-[600px]">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedRows.length === tableData.length && tableData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="border-b p-2 text-left">Type</th>
                  <th className="border-b p-2 text-left">Color</th>
                 
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr
                    key={row.id}
                    className={`cursor-pointer hover:bg-gray-100 ${selectedRows.includes(row.id) ? "bg-gray-200" : ""}`}
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
                    <td className="border-t p-2">{row.type}</td>
<td className="border-t p-2">
  <div className="w-6 h-6 rounded" style={{ backgroundColor: row.color }}></div>
</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Context Menu */}
            {contextMenu.visible && (
  <div
    style={{
      position: "absolute",
      top: contextMenu.y,
      left: contextMenu.x,
      backgroundColor: "white",
      border: "1px solid #ccc",
      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      zIndex: 1000,
    }}
  >
    <ul className="p-1 m-0 list-none">
    <li
  className="p-2 hover:bg-gray-100 cursor-pointer"
  onClick={handleEditFromContext}
>
  Edit
</li>
      <li
        className="px-4 py-1 hover:bg-red-100 cursor-pointer text-red-600"
        onClick={handleDeleteRows}
      >
        Delete
      </li>
    </ul>
  </div>
)}
          </div>
        </div>
      </div>

      <div className="card card-primary w-full lg:w-1/3 self-start">
  <div className="card-header">
    <h3 className="card-title text-white">Filter Setup</h3>
  </div>

  <form>
    <div className="card-body">
      
        {/* FLOATING INPUT — TYPE */}
  <div className="mb-4 relative">
    <input
      type="text"
      name="type"
      placeholder=" "
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="
        peer block w-full rounded border border-gray-300 px-2 
        pt-3 pb-1 text-xs h-8
        focus:border-blue-500 focus:outline-none
      "
    />
    <label
      className="
        absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75
        bg-white px-1 text-gray-500 transition-all duration-200
        peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0
        peer-placeholder-shown:scale-100
        peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-500
      "
    >
      Type
    </label>
  </div>

  {/* FLOATING INPUT — COLOR PICKER */}
  <div className="mb-4 relative">
    <input
      type="color"
      name="color"
      placeholder=" "
      defaultValue="#000000"
      value={color}
      onChange={(e) => setColor(e.target.value)}
      className="
        peer block w-full rounded border border-gray-300 px-2 
        pt-3 pb-1 text-xs h-10
        focus:border-blue-500 focus:outline-none
      "
    />
    <label
      className="
        absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75
        bg-white px-1 text-gray-500 transition-all duration-200
        peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0
        peer-placeholder-shown:scale-100
        peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-500
      "
    >
      Color
    </label>
  </div>


    </div>

    <div className="card-footer flex flex-row justify-between gap-3 ">
           
           
            <button
    type="button"
    className="h-7 border-2 rounded-md border-blue-400 btn-outline-primary w-full"
    onClick={editId ? handleUpdate : handleSave}
  >
    {editId ? "Update" : "Save"}
  </button>

  {editId && (
    <button
      type="button"
      className="h-7 border-2 rounded-md border-gray-400 w-full"
      onClick={handleResetEdit}
    >
      Reset
    </button>
  )}

          </div>
  </form>
</div>
{/* DELETE CONFIRM MODAL */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded shadow-lg w-80 text-xs">
      <h3 className="font-semibold mb-2">Confirm Delete</h3>

      <p className="mb-2">Are you sure you want to delete the following items?</p>

      <ul className="list-disc pl-5 max-h-40 overflow-y-auto text-gray-700 mb-3">
        {selectedRows.map((id) => {
          const row = tableData.find((r) => r.id === id);
          return <li key={id}>{row?.type}</li>;
        })}
      </ul>

      <div className="flex justify-end gap-2 mt-3">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={confirmDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default FilterSetup