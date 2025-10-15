import React, { useCallback, useEffect, useRef, useState } from "react";
import UpdateSchedulerModal from "./UpdateSchedulerModal";
import { ToastContainer, toast } from 'react-toastify';

const TableMeta = ( {data, onMoveRow, from, 
  columns, 
  onSearch, 
  onSort, 
  onPageChange,
  onRowClick,
  totalRecords = 0,
  currentPage = 1,
  pageSize = 10,
  loading = false,
  searchValue = '',
  serverSide = true,
  getRowClassName, // New prop for custom row classes
  fillHeight = true  }) => {

    const [localSearchValue, setLocalSearchValue] = useState(searchValue);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [containerHeight, setContainerHeight] = useState('auto');
    const containerRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);

const [contextMenu, setContextMenu] = useState(null);
const [selectedRow, setSelectedRow] = useState(null);


const [showUpdate, setShowUpdate] = useState(false);

const [selectedRows, setSelectedRows] = useState([]);
const [clipboard, setClipboard] = useState(null);

const [blankContextMenu, setBlankContextMenu] = useState(null);

const handleUpdateClick = (row) => {
  setSelectedRow(row);
  setShowUpdate(true);
};

const [formInputs, setFormInputs] = useState({
  date: "",
  category: "",
  check: false,
  type: "",
  isCommercial: false,
  endDate: "",
  bonus: false,
});




useEffect(() => {
  setFilteredData(prevFiltered => {
    // Keep local rows that aren't in `data` yet (e.g., copied rows)
    const localOnlyRows = prevFiltered.filter(row => !data.some(d => d.id === row.id));
    // Merge parent `data` with local-only rows
    const merged = [...data, ...localOnlyRows];

    // Then apply search filter
    return merged.filter(
      row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
}, [searchTerm, data]);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("rowData", JSON.stringify(item));
    e.dataTransfer.setData("fromTable", from);

  
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("rowData"));
    const fromTable = e.dataTransfer.getData("fromTable");

    // Find the <tr> element where the drop happened
    const tr = e.target.closest("tr");
    let insertIndex = null;

    if (tr && tr.dataset && tr.dataset.rowId) {
      const targetId = tr.dataset.rowId;
      // find index of that row in filteredData
      const idx = filteredData.findIndex(r => String(r.id) === String(targetId));
      if (idx >= 0) {
        insertIndex = idx + 1; // insert AFTER the row (as you specified)
      }
    }

    // If drop not on a row, default to append at end
    if (insertIndex === null) {
      insertIndex = filteredData.length;
    }

    if (fromTable !== from) {
      // pass insertIndex to parent moveRow
      onMoveRow(item, fromTable, from, insertIndex);
    }
  };
  
    // Debounced search
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (onSearch && localSearchValue !== searchValue) {
          onSearch(localSearchValue);
        }
      }, 500);
  
      return () => clearTimeout(timeoutId);
    }, [localSearchValue, onSearch, searchValue]);
  
    // Calculate dynamic height
    useEffect(() => {
      if (!fillHeight) return;
  
      const calculateHeight = () => {
        if (containerRef.current) {
          // For DataTable inside a card, use the parent container height
          const parentElement = containerRef.current.parentElement;
          if (parentElement) {
            const parentHeight = parentElement.clientHeight;
            setContainerHeight(`${parentHeight}px`);
          } else {
            // Fallback to viewport calculation
            const viewportHeight = window.innerHeight;
            const rect = containerRef.current.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY;
            const bottomMargin = 100;
            const availableHeight = viewportHeight - offsetTop - bottomMargin;
            const minHeight = 400;
            const finalHeight = Math.max(availableHeight, minHeight);
            setContainerHeight(`${finalHeight}px`);
          }
        }
      };
  
      // Calculate on mount and resize
      calculateHeight();
      window.addEventListener('resize', calculateHeight);
      
      // Recalculate after a short delay to account for layout changes
      const timeoutId = setTimeout(calculateHeight, 100);
  
      return () => {
        window.removeEventListener('resize', calculateHeight);
        clearTimeout(timeoutId);
      };
    }, [fillHeight]);
  
    const handleSort = useCallback((key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      
      setSortConfig({ key, direction });
      if (onSort) {
        onSort(key, direction);
      }
    }, [sortConfig, onSort]);
  
    const handlePageClick = useCallback((page) => {
      if (onPageChange && page !== currentPage) {
        onPageChange(page);
      }
    }, [currentPage, onPageChange]);
  
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startRecord = ((currentPage - 1) * pageSize) + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);
  
    const renderPagination = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      // Calculate start and end page numbers
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust startPage if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
  
      // Previous button
      pages.push(
        <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        </li>
      );
  
      // First page and ellipsis
      if (startPage > 1) {
        pages.push(
          <li key="1" className="page-item">
            <button className="page-link" onClick={() => handlePageClick(1)}>1</button>
          </li>
        );
        if (startPage > 2) {
          pages.push(
            <li key="ellipsis-start" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
      }
  
      // Page numbers
      for (let page = startPage; page <= endPage; page++) {
        pages.push(
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageClick(page)}>
              {page}
            </button>
          </li>
        );
      }
  
      // Last page and ellipsis
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <li key="ellipsis-end" className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          );
        }
        pages.push(
          <li key={totalPages} className="page-item">
            <button className="page-link" onClick={() => handlePageClick(totalPages)}>
              {totalPages}
            </button>
          </li>
        );
      }
  
      // Next button
      pages.push(
        <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </li>
      );
  
      return pages;
    };
  
    


    // ✅ Add this to your component state:


// ✅ Function to toggle individual row selection
const handleRowSelect = (id) => {
  setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
  );
};

const handleRowRightClick = (e, row) => {
  e.preventDefault(); // prevent default browser menu
  setSelectedRows([row.id]); // select this row
  setContextMenu({
    mouseX: e.clientX + 2,
    mouseY: e.clientY - 6
  });
};

// ✅ Function to toggle all
const handleSelectAll = () => {
  if (selectedRows.length === filteredData.length) {
    setSelectedRows([]);
  } else {
    setSelectedRows(filteredData.map((row) => row.id));
  }

}

// Inside TableMeta
const handleCopyRows = () => {
  const newRows = selectedRows.map(id => {
    const row = filteredData.find(r => r.id === id);
    return { ...row, id: Date.now() + Math.random(), name: `${row.name} (Copy)` };
  });

  // 1️⃣ Add to local state
  setFilteredData(prev => [...prev, ...newRows]);

  // 2️⃣ Also inform parent to update metaData
  if (onMoveRow) {
    newRows.forEach(row => onMoveRow(row, from, "metaCopy"));
  }

  setSelectedRows([]);
  setContextMenu(null);
};


useEffect(() => {
  const handleOutsideClick = (e) => {
    // If click is NOT on table row or context menu → clear selection & menu
    if (!e.target.closest("tr") && !e.target.closest(".custom-context-menu")) {
      setSelectedRows([]);
      setContextMenu(null);
    }
  };

  document.addEventListener("click", handleOutsideClick);
  return () => document.removeEventListener("click", handleOutsideClick);
}, []);

useEffect(() => {
  const handleOutsideRightClick = (e) => {

   // Allow right-clicks on selected rows without clearing
   const isOnRow = e.target.closest("tr");
  const isInMenu = e.target.closest(".custom-context-menu");
  if (!isOnRow && !isInMenu) {
      setSelectedRows([]);
      setContextMenu(null);
    }
  }
  

  document.addEventListener("contextmenu", handleOutsideRightClick);
  return () => document.removeEventListener("contextmenu", handleOutsideRightClick);
}, []);


  
    return (
      <div 
        ref={containerRef}
        className="datatable-container w-full h-full flex flex-col" 
        style={{
          height: fillHeight ? containerHeight : 'auto'
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Toast container */}
    
        {/* Header with Search */}
        <div className="datatable-header d-flex justify-content-between px-2 py-2 align-items-center">
          <div className="mb-0 text-rundown">
            <i className="fas fa-table mr-2"></i>
            Programme Schedule
          </div>
          
          <div className="datatable-search">
            <ul className="flex gap-1">
            <i className="fas fa-search search-icon "></i>
          <i><input
              
              className="form-control form-control-sm"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /></i>
            </ul>
          
            
            
          </div>
        </div>
  
        {/* Table Body with Fixed Height and Scroll */}
        <div className="datatable-body overflow-x-auto">

        <table
  className="datatable-table table table-hover w-full min-w-max"
  onContextMenu={(e) => {
    e.preventDefault();

    // If clicked on any row or cell → do nothing
    if (e.target.closest("tr") || e.target.closest("td")) return;

    setContextMenu(null);
  
  }}>

<thead className="bg-gray-100">
  <tr >
    <th className=" py-3 w-[10px]">
      {/* Optional: Master Checkbox */}
      <label className="flex items-center justify-center gap-1">
    <input
      type="checkbox"
      checked={selectedRows.length === filteredData.length && filteredData.length > 0}
      onChange={handleSelectAll}
      className="cursor-pointer"
    />
    All
  </label>
    </th>
    <th className="px-4 py-3 w-[20px]">ID</th>
    <th className="px-4 py-3 w-[80px]">Start Time</th>
    <th className="px-4 py-3 w-[80px]">End Time</th>
    <th className="px-4 py-3 w-[150px]">Programme Name</th>
    <th className="px-4 py-3 w-[80px]">Type</th>
    <th className="px-4 py-3 w-[80px]">Duration</th>
    <th className="px-4 py-3 w-[20px]">L/P/D</th>
  </tr>
</thead>
<tbody>
  {filteredData.length === 0 ? (
    <tr>
      <td colSpan="8" className="px-4 py-6 text-center text-gray-500 italic">
        No data
      </td>
    </tr>
  ) : (
    filteredData.map((row, index) => {
      console.log("Row data:", row);
      // Compute Start Time
      const startParts = row.startTime?.split(":") || ["00", "00", "00"];
  
  // Use previous row's total frame as start frame
  let startFrame = "00";
  if (index > 0) {
    const prevRow = filteredData[index - 1];
    const prevFrame = parseInt(prevRow.prevFrameRate || "0");
    const currFrame = parseInt(prevRow.frameRate || "0");
    let totalFrame = prevFrame + currFrame;
    totalFrame = totalFrame % 25; // assuming 25 fps
    startFrame = String(totalFrame).padStart(2, "0");
  } else {
    startFrame = String(parseInt(row.prevFrameRate || "0")).padStart(2, "0");
  }

  const startTimeStr = `${startParts[0].padStart(2,"0")}:${startParts[1].padStart(2,"0")}:${startParts[2].padStart(2,"0")}:${startFrame}`;

      // Compute End Time
      const durationParts = row.duration?.split(":") || ["0","0","0"];
      const prevFrame = parseInt(row.prevFrameRate || "0");
      const currFrame = parseInt(row.frameRate || "0");
      let totalFrame = prevFrame + currFrame;
      const extraSeconds = Math.floor(totalFrame / 25); // Assuming 25fps
      totalFrame = totalFrame % 25;

      const endDate = new Date(row.prevEndTime || new Date(0));
      endDate.setHours(endDate.getHours() + parseInt(durationParts[0] || "0"));
      endDate.setMinutes(endDate.getMinutes() + parseInt(durationParts[1] || "0"));
      endDate.setSeconds(endDate.getSeconds() + parseInt(durationParts[2] || "0") + extraSeconds);

      const endTimeStr = `${String(endDate.getHours()).padStart(2,"0")}:${String(endDate.getMinutes()).padStart(2,"0")}:${String(endDate.getSeconds()).padStart(2,"0")}:${String(totalFrame).padStart(2,"0")}`;

      return (
        <tr
        key={row.id}
        data-row-id={row.id}   
  draggable
  onDragStart={(e) => handleDragStart(e, row)}

  onClick={() => handleRowSelect(row.id)} // Left click select

  onContextMenu={(e) => {
    e.preventDefault();
    
    setSelectedRows((prev) => {
      if (prev.includes(row.id)) return prev; // keep existing selection
      return [...prev, row.id]; // add new row to selection
    });
  
    setContextMenu({
      mouseX: e.clientX + 2,
      mouseY: e.clientY - 6,
    });
  }}

  className={selectedRows.includes(row.id) ? "bg-gray-100 cursor-pointer" : "cursor-pointer"}
        >
          <td className="px-2 w-[10px]">
            <input
              type="checkbox"
              checked={selectedRows.includes(row.id)}
              onChange={() => handleRowSelect(row.id)}
              onClick={(e) => e.stopPropagation()}
            />
          </td>
          <td className="px-4 py-3">{row.id}</td>
          <td className="px-4 py-3">{startTimeStr}</td>
          <td className="px-4 py-3">{endTimeStr}</td>
          <td className="px-4 py-3">{row.name}</td>
          <td className="px-4 py-3">{row.type}</td>
          <td className="px-4 py-3">
  {(() => {
    const durationParts = row.duration?.split(":") || ["0","0","0"];
    
    const currFrame = parseInt(row.frameRate || "0");
   

    const frameValue = String(currFrame % 25).padStart(2, "0"); // Assuming 25 FPS

    return `${durationParts[0].padStart(2,"0")}:${durationParts[1].padStart(2,"0")}:${durationParts[2].padStart(2,"0")}:${frameValue}`;
  })()}
</td>
          <td className="px-4 py-3">{row.isPaid ? "Yes" : "No"}</td>
        </tr>
      );
    })
  )}
</tbody>



  </table>
  {contextMenu && (
 <div
 className="custom-context-menu fixed bg-white border rounded shadow-md z-50 text-sm"
 style={{
   top: contextMenu.mouseY,
   left: contextMenu.mouseX,
 }}
 onMouseLeave={() => setContextMenu(null)}
>
 {/* Update Button */}
 {selectedRows.length === 1 && (
  <button
    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
    onClick={() => {
      setShowUpdate(true);
      setContextMenu(null);
    }}
  >
    Update
  </button>
)}

 {/* Copy Button */}
 {/* Copy Button */}
 <button
  onClick={handleCopyRows}
  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
>
  Copy
</button>



 {/* Delete Button */}
 <button
  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
  onClick={() => {
    if (selectedRows.length === 0) return;

    // Split selected rows into parent rows vs local-only rows
    const parentRowsToDelete = [];
    const localRowsToDelete = [];

    selectedRows.forEach(id => {
      const parentRow = data.find(r => r.id === id);
      if (parentRow) parentRowsToDelete.push(parentRow);
      else {
        const localRow = filteredData.find(r => r.id === id);
        if (localRow) localRowsToDelete.push(localRow);
      }
    });

    // Delete local rows
    setFilteredData(prev => prev.filter(r => !selectedRows.includes(r.id)));

    // Delete parent rows via onMoveRow (so toast can trigger)
    parentRowsToDelete.forEach(row => onMoveRow(row, from, null));

    // For local rows, you can manually trigger the toast if needed:
   // parentRowsToDelete.forEach(row => toast.info(`Deleted "${row.name}"`));

    // Clear selection and close context menu
    setSelectedRows([]);
    setContextMenu(null);
  }}
>
  Delete
</button>
</div>
)}

{showUpdate && (
  <UpdateSchedulerModal
    show={showUpdate}
    selectedRow={selectedRow}
    formInputs={formInputs}
    setFormInputs={setFormInputs}
    onClose={() => setShowUpdate(false)}
    onConfirm={(updatedData) => {
      console.log("Updated data:", updatedData);
      setShowUpdate(false);
    }}
  />
)}

</div>

{/* Footer stays under the table */}
<div className="datatable-footer bg-white border-t mt-2 p-2">
  <div className="datatable-info">
    Showing {totalRecords > 0 ? startRecord : 0} to {endRecord} of {totalRecords} entries
    {localSearchValue && ` (filtered from ${totalRecords} total entries)`}
  </div>
  {totalPages > 1 && (
    <nav>
      <ul className="datatable-pagination pagination pagination-sm">
        {renderPagination()}
      </ul>
    </nav>
  )}
</div>
  
      
      </div>
    );
};

export default TableMeta;