import React, { useEffect, useRef, useState } from 'react'

const initialTableData = [
    { id: 1, engine: "PROMO", browser: "#07865F", },
    { id: 2, engine: "COM", browser: "IE 5.0",  },
    { id: 3, engine: "Webkit", browser: "Safari 1.3",  },
    { id: 4, engine: "Webkit", browser: "Safari 2.0",  },
    { id: 5, engine: "Webkit", browser: "Safari 3.0", },
    { id: 6, engine: "Webkit", browser: "OmniWeb 5.5", },
    { id: 7, engine: "Other browsers", browser: "All others",  },
  ];



const FilterSetup = () => {
    const [tableData, setTableData] = useState([]);
      const [selectedRows, setSelectedRows] = useState([]);
      const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowId: null });
      const [type, setType] = useState("");
const [color, setColor] = useState("#000000");
    
      const tableRef = useRef();
    
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
      const handleDeleteRows = async () => {
        await Promise.all(selectedRows.map(id =>
          fetch(`http://localhost:8080/api/v1/filters/${id}`, { method: "DELETE" })
        ));
        setSelectedRows([]);
        loadTableData(); // Refresh table
      };

      const loadTableData = async () => {
        try {
          const res = await fetch("http://127.0.0.1:8080/api/v1/filters");
          const data = await res.json();
          setTableData(data);
        } catch (err) {
          console.error("Failed to load filters:", err);
        }
      };
      
      useEffect(() => {
        loadTableData();
      }, []);

      const handleSave = async () => {
        if (!type) return alert("Type is required");
      
        const payload = { type, color };
        try {
          const res = await fetch("http://127.0.0.1:8080/api/v1/filters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      
          if (!res.ok) throw new Error("Failed to save filter");
      
          // Clear inputs
          setType("");
          setColor("#000000");
      
          // Reload table
          loadTableData();
        } catch (err) {
          console.error(err);
          alert("Error saving filter");
        }
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
           
            <button type="button" className="h-7 border-2 rounded-md  border-blue-400 btn-outline-primary flex-1 "  onClick={handleSave}> Save</button>
            <button type="button" className="h-7 border-2 rounded-md  border-blue-400 btn-outline-primary flex-1">Edit</button>
          </div>
  </form>
</div>
    </div>
  )
}

export default FilterSetup