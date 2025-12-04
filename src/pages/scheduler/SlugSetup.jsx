import React, { useState, useRef, useEffect } from "react";
import axios from "axios";


export const SlugSetup = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowId: null });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const tableRef = useRef();

  useEffect(() => {
    fetchSlugs();
  }, []);
  
  const fetchSlugs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/slug/`);
      setTableData(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch slugs");
    }
  };

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

  const handleCreate = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/slug/`,
        formData
      );
  
      setFormData({  programe_name: "", slug: "", slug_repeat: "" });
      fetchSlugs(); // refresh table
  
      alert("Created successfully!");
    } catch (error) {
      console.error(error);
      alert("Create failed");
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
  const handleDeleteRows = async () => {
    try {
      for (const id of selectedRows) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/slug/${id}`);
      }
  
      setSelectedRows([]);
      setContextMenu({ ...contextMenu, visible: false });
      fetchSlugs();
  
      alert("Deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };
  

  const [editId, setEditId] = useState(null);

const [formData, setFormData] = useState({
  programe_name: "",
  slug: "",
  slug_repeat: "",
});

const handleEditRow = (id) => {
  const row = tableData.find((r) => r.id === id);

  setFormData({
    programe_name: row.programe_name,
    slug: row.slug,
    slug_repeat: row.slug_repeat,
  });

  setEditId(id);
  setContextMenu({ ...contextMenu, visible: false });
};

const handleSave = async () => {
  if (!editId) {
    handleCreate();
    return;
  }

  try {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/v1/slug/${editId}`,
      formData
    );

    setEditId(null);
    setFormData({  programe_name: "", slug: "", slug_repeat: "" });
    fetchSlugs();

    alert("Updated successfully!");
  } catch (error) {
    console.error(error);
    alert("Update failed");
  }
};

const handleReset = () => {
  setEditId(null);
  setFormData({ programe_name: "", slug: "", slug_repeat: "" });
};


  return (
    <div className="flex lg:flex-row flex-col mt-2 text-xs gap-4">
      {/* TABLE SECTION */}
      <div className="w-full lg:w-2/3 overflow-x-auto" ref={tableRef}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">DataTable with multiple select</h3>
          </div>

          <div className="table-responsive ">
            <table className="table table-collapse table-hover w-full">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedRows.length === tableData.length && tableData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="border-b p-2 text-left">Programee Code</th>
                  <th className="border-b p-2 text-left">Slug Name</th>
                  <th className="border-b p-2 text-left">Slug Name Repeat</th>
                
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
                    <td className="border-t p-2">{row.programe_name}</td>
                    <td className="border-t p-2">{row.slug}</td>
                    <td className="border-t p-2">{row.slug_repeat}</td>
                  
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
      {/* EDIT */}
      <li
        className="px-4 py-1 hover:bg-blue-100 cursor-pointer text-blue-600"
        onClick={() => handleEditRow(contextMenu.rowId)}
      >
        Edit
      </li>
      <li
        className="px-4 py-1 hover:bg-red-100 cursor-pointer text-red-600"
        onClick={() => setShowConfirmModal(true)}
      >
        Delete
      </li>
    </ul>
  </div>
)}
          </div>
        </div>
      </div>

      {/* FORM SECTION */}
     {/* FORM SECTION */}
<div className="card card-primary w-full lg:w-1/3 self-start">
  <div className="card-header">
    <h3 className="card-title text-white">Slug Name Input Form</h3>
  </div>

  <form>
    <div className="card-body">

      {/* Programee Code */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={formData.programe_name}
  onChange={(e) => setFormData({ ...formData,  programe_name: e.target.value })}
          placeholder=" "
          className="
            peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-9
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
          Programee Code
        </label>
      </div>

      {/* Slug Name */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={formData.slug}
  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder=" "
          className="
            peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-9
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
          Slug Name
        </label>
      </div>

      {/* Slug Name Repeat */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={formData.slug_repeat}
  onChange={(e) => setFormData({ ...formData, slug_repeat: e.target.value })}
          placeholder=" "
          className="
            peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-9
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
          Slug Name Repeat
        </label>
      </div>

    </div>

    <div className="card-footer flex flex-row justify-between gap-3 ">
      
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

{/* CONFIRM DELETE MODAL */}
{showConfirmModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded shadow-md w-80 text-xs">
      <h3 className="font-semibold mb-2">Are you sure?</h3>
      <p className="mb-2">You are about to delete the following items:</p>

      <ul className="list-disc ml-4 mb-4">
        {selectedRows.map((id) => {
          const item = tableData.find((row) => row.id === id);
          return (
            <li key={id}>
              {item?.programe_name || "(no name)"} — {item?.slug}
            </li>
          );
        })}
      </ul>

      <div className="flex justify-end gap-3">
        <button
          className="px-3 py-1 border rounded text-gray-600 border-gray-400"
          onClick={() => setShowConfirmModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={async () => {
            await handleDeleteRows();
            setShowConfirmModal(false);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};
