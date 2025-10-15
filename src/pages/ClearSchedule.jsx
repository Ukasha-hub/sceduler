import React, { useEffect, useRef, useState } from 'react'

const initialTableData = [
    { id: 1, engine: "Trident", browser: "IE 4.0", platform: "Win 95+", version: "4", grade: "X" },
    { id: 2, engine: "Trident", browser: "IE 5.0", platform: "Win 95+", version: "5", grade: "C" },
    { id: 3, engine: "Webkit", browser: "Safari 1.3", platform: "OSX.3", version: "312.8", grade: "A" },
    { id: 4, engine: "Webkit", browser: "Safari 2.0", platform: "OSX.4+", version: "419.3", grade: "A" },
    { id: 5, engine: "Webkit", browser: "Safari 3.0", platform: "OSX.4+", version: "522.1", grade: "A" },
    { id: 6, engine: "Webkit", browser: "OmniWeb 5.5", platform: "OSX.4+", version: "420", grade: "A" },
    { id: 7, engine: "Other browsers", browser: "All others", platform: "-", version: "-", grade: "U" },
  ];

const ClearSchedule = () => {
     const [tableData, setTableData] = useState(initialTableData);
          const [selectedRows, setSelectedRows] = useState([]);
          const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowId: null });
        
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
      const handleDeleteRows = () => {
        setTableData(tableData.filter((row) => !selectedRows.includes(row.id)));
        setSelectedRows([]);
        setContextMenu({ ...contextMenu, visible: false });
        alert("Selected row(s) deleted!");
      };
  return (
    <div className="flex lg:flex-row flex-col mt-2 text-xs gap-4">
        <div className="w-full lg:w-2/3 overflow-x-auto" ref={tableRef}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">DataTable with multiple select</h3>
          </div>

          <div className="card-body">
            <table className="table table-bordered table-hover min-w-[600px]">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedRows.length === tableData.length && tableData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Server 1</th>
                  <th>Server 2</th>
                  <th>Server 3</th>
                  
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
                    <td>{row.engine}</td>
                    <td>{row.browser}</td>
                    <td>{row.platform}</td>
                 
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
    <h3 className="card-title text-white">Clear Schedule</h3>
  </div>

  <form>
    <div className="card-body">
      
      {/* Type Field (Text Input instead of Select) */}
      <div className="form-group mb-2">
        <label className='pr-2'>To Date</label>
        <input
          type="text"
         className="border rounded px-1 py-0.5 h-7 w-75 "
          id="type"
          placeholder="Enter Type"
        />
      </div>

      
      

    </div>

    <div className="card-footer flex flex-row justify-between gap-3 ">
           
            <button type="button" className="btn btn-outline-primary w-10 h-10 flex-1 pb-2"> Save</button>
            <button type="button" className="btn btn-outline-primary flex-1">Edit</button>
          </div>
  </form>
</div>
    </div>
  )
}

export default ClearSchedule