import React, { useCallback, useEffect, useRef, useState } from "react";
import UpdateSchedulerModal from "../Modal/scheduler/UpdateSchedulerModal";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

import AddNewRowModal from "../Modal/scheduler/AddNewRowModal";

const TableMeta = ( {data, metaData, onMoveRow, from, 
  columns, 
  onSearch, 
  onSort, 
  onPageChange,
  formatDateTimeWithFrame,
  recalcSchedule,
  onRowClick,
  prevTimePeriod,
  setPendingRow,
  pendingRow,
  setMetaData,
  handleAddConfirm ,
  computeTimePeriod,
  computeDuration,
  formatDate,
  onDeleteRow,
  totalRecords = 0,
  currentPage = 1,
  pageSize = 10,
  loading = false,
  searchValue = '',
  serverSide = true,
  getRowClassName, // New prop for custom row classes
  fillHeight = true,
  selectedDate  }) => {

    const [localSearchValue, setLocalSearchValue] = useState(searchValue);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [containerHeight, setContainerHeight] = useState('auto');
    const containerRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
console.log("filteredData", data)
const [contextMenu, setContextMenu] = useState(null);
const [selectedRow, setSelectedRow] = useState(null);


const [showUpdate, setShowUpdate] = useState(false);

const [selectedRows, setSelectedRows] = useState([]);
const [clipboard, setClipboard] = useState(null);
const [showAddNewModal, setShowAddNewModal] = useState(false);

const [showImportPackageModal, setShowImportPackageModal] = useState(false);
const [availablePackages, setAvailablePackages] = useState([]);
const [selectedPackageName, setSelectedPackageName] = useState("");
const [typeColors, setTypeColors] = useState({});
//`${process.env.REACT_APP_API_URL}/api/v1/hourly-ad/`

useEffect(() => {
  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/package/`);
      setAvailablePackages(res.data || []);
    } catch (err) {
      console.error("Failed to load packages", err);
      toast.error("Failed to load packages");
    }
  };

  fetchPackages();
}, []);

useEffect(() => {
  setSelectedRows([]);
}, [data]);

console.log("dataDATA",data)

const handleAddNewConfirm = (newRowData) => {
  const newRow = {
    id: Date.now(),
    ...newRowData,
  };
  setMetaData((prev) => [...prev, newRow]);
};



const [formInputs, setFormInputs] = useState({
 date: new Date().toISOString().split("T")[0],
  id: Date.now()+ Math.random(),
  slug: "",
  name: "",
  type: "",
  rateAgreementNo: "",
  agency: "",
  duration: "",
  selectOption: "",
  bonus: false,
  selectSpot: "",
  repeat: false,
  com: false,
});

useEffect(() => {
  console.log("Modal state changed:", showAddNewModal);
}, [showAddNewModal]);


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
    e.dataTransfer.setData("rowId", item.id);
    e.dataTransfer.setData("fromTable", from);

  
  };

  // Example: convert time object to string HH:MM:SS:FF
const formatTimeWithFrame = (tp) => {
 // console.log("insidde formatTimeWithFrame", tp)
  if (!tp) return "--:--:--:--";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(tp.hour)}:${pad(tp.minute)}:${pad(tp.second)}:${pad(tp.frame)}`;
};

useEffect(() => {
  const fetchFilters = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/filters/`);
      const colorMap = {};
      res.data.forEach(item => {
        colorMap[item.type] = item.color;
      });
      setTypeColors(colorMap);
    } catch (err) {
      console.error("Failed to load filter colors", err);
    }
  };

  fetchFilters();
}, []);


  const handleDrop = (e) => {
  e.preventDefault();
  const item = JSON.parse(e.dataTransfer.getData("rowData"));
  const fromTable = e.dataTransfer.getData("fromTable");

  // clone the row with a new unique id
  const newRow = { ...item, id: Date.now() + Math.random() };

  // Find the <tr> element where the drop happened
  const tr = e.target.closest("tr");
  let insertIndex = null;

  

  if (insertIndex === null) insertIndex = filteredData.length;

  // Insert row in filteredData at correct index
 

  if (fromTable !== from && onMoveRow) {
    onMoveRow(newRow, fromTable, from, insertIndex);
  }
};

const handleInternalRowDrop = (e) => {
  e.preventDefault();

  const draggedRowId = e.dataTransfer.getData("rowId");
  const fromTable = e.dataTransfer.getData("fromTable");

  // ❌ Ignore external drops (keep your existing handleDrop for those)
  if (!draggedRowId || fromTable !== from) return;

  const draggedIndex = metaData.findIndex(
    r => String(r.id) === String(draggedRowId)
  );
  if (draggedIndex === -1) return;

  const tr = e.target.closest("tr");
  let targetIndex = metaData.length - 1; // default → last

  if (tr?.dataset?.rowId) {
    const targetId = tr.dataset.rowId;
    const idx = metaData.findIndex(r => String(r.id) === String(targetId));
    if (idx !== -1) targetIndex = idx;
  }

  if (draggedIndex === targetIndex) return;

  setMetaData(prev => {
    const updated = [...prev];
    const [movedRow] = updated.splice(draggedIndex, 1);

    const insertIndex =
      draggedIndex < targetIndex ? targetIndex : targetIndex;

    updated.splice(insertIndex, 0, movedRow);
    return recalcSchedule ? recalcSchedule(updated) : updated;
  });
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
  
    const totalPages = totalRecords;
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



// ✅ Function to toggle all
const handleSelectAll = () => {
  if (selectedRows.length === filteredData.length) {
    setSelectedRows([]);
  } else {
    setSelectedRows(filteredData.map((row) => row.id));
  }

}

// Inside TableMeta
// ✅ COPY → Only store in clipboard
const handleCopyRows = () => {
  const rowsToCopy = selectedRows.map(id => {
    const row = filteredData.find(r => r.id === id);
    if (!row) return null;

    const lastIndex = data.findIndex(r => r.id === row.id);
    const prevRow = lastIndex >= 0 ? data[lastIndex] : null;

    const prevTP = prevRow ? prevRow.timePeriod : { hour:0, minute:0, second:0, frameRate:0 };
    const prevEnd = prevRow ? prevRow.endTime : formatDate(new Date(new Date().setHours(0,0,0,0)));

    const newTP = computeTimePeriod(prevTP, row.duration);
    const baseStart = prevRow ? new Date(prevRow.endTime) : new Date(new Date().setHours(0,0,0,0));
    const durationMs = computeDuration(row.duration);

    return {
      ...row,
      id: Date.now() + Math.random(),
      name: `${row.name} (Copy)`,
      prevTimePeriod: prevTP,
      prevEndTime: prevEnd,
      timePeriod: newTP,
      frameRate: newTP.frameRate,
      startTime: formatDate(baseStart),
      endTime: formatDate(new Date(baseStart.getTime() + durationMs)),
      __insertIndex: lastIndex + 1
    };
  }).filter(Boolean);

  setClipboard(rowsToCopy); // ✅ Only save rowsToCopy here
  setSelectedRows([]);
  setContextMenu(null);
 // console.log("Copied to clipboard:", rowsToCopy);
};



const handlePaste = (insertAfterId = null, newDate = null) => {
  if (!clipboard || clipboard.length === 0) return;

  const newRows = clipboard.map(row => ({
    ...row,
    id: Date.now() + Math.random(), // ensure unique id
    startTime: newDate ? `${newDate} ${row.startTime.split(" ")[1]}` : row.startTime,
    endTime: newDate ? `${newDate} ${row.endTime?.split(" ")[1] || ""}` : row.endTime,
  }));

  setMetaData(prev => {
    const updated = [...prev];
    let insertIndex = updated.length;

    if (insertAfterId !== null) {
      const idx = updated.findIndex(r => String(r.id) === String(insertAfterId));
      if (idx >= 0) insertIndex = idx + 1;
    }

    

    updated.splice(insertIndex, 0, ...newRows); // ✅ Insert here
    return recalcSchedule(updated);
  });

  setClipboard(null); // Clear clipboard
 // console.log("Pasted rows:", newRows);
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

const handleAddFile = (row) => {
  if (!row) return;

  const prevEndTime = row.endTime || "1970-01-01 00:00:00";
  const prevTimePeriod = row.timePeriod || {};
  const prevFrameRate = prevTimePeriod.frameRate || 0;

  setPendingRow({
    __insertAfterId: row.id,
    __insertAfterName: row.name,
    prevEndTime,
    prevTimePeriod,
    prevFrameRate,
    duration: "00:00:00:00",
    type: row.type,
  });

  setShowAddNewModal(true);
};

const handleConfirmAddFile = (newRowData) => {
  console.log("pendingRow:", pendingRow)
  if (!pendingRow) return;

  const insertAfterId = pendingRow.__insertAfterId;
  const rowIndex = metaData.findIndex(
    r => String(r.id) === String(insertAfterId)
  );

  // Compute new start and end time
  const FPS = 25;
  const [prevDateStr, prevTimeStr] = (pendingRow.prevEndTime || "1970-01-01 00:00:00").split(" ");
  const [prevHH, prevMM, prevSS] = prevTimeStr.split(":").map(Number);
  const prevFF = pendingRow.prevTimePeriod?.frameRate ?? (pendingRow.prevFrameRate % FPS || 0);
  const [durH, durM, durS, durF] = (newRowData.duration || "00:00:00:00")
    .split(":")
    .map((v) => parseInt(v, 10) || 0);

  let totalFrames =
    ((prevHH * 3600 + prevMM * 60 + prevSS) * FPS + prevFF) +
    ((durH * 3600 + durM * 60 + durS) * FPS + durF);

  const finalHours = Math.floor(totalFrames / (FPS * 3600));
  totalFrames %= FPS * 3600;
  const finalMinutes = Math.floor(totalFrames / (FPS * 60));
  totalFrames %= FPS * 60;
  const finalSeconds = Math.floor(totalFrames / FPS);
  const finalFrames = totalFrames % FPS;

  const dayOffset = Math.floor(finalHours / 24);
  const displayHours = finalHours % 24;

  const prevDate = new Date(prevDateStr);
  prevDate.setDate(prevDate.getDate() + dayOffset);
  const finalEndDate = prevDate.toISOString().split("T")[0];

  const finalEndTime =
    `${String(displayHours).padStart(2, "0")}:` +
    `${String(finalMinutes).padStart(2, "0")}:` +
    `${String(finalSeconds).padStart(2, "0")}:` +
    `${String(finalFrames).padStart(2, "0")}`;

  const newRow = {
    ...newRowData,
    id: Date.now(),
    startTime: pendingRow.prevEndTime,
    endTime: `${finalEndDate} ${finalEndTime}`,
    timePeriod: {
      hour: prevHH,
      minute: prevMM,
      second: prevSS,
      frameRate: prevFF,
    },
     prevTimePeriod: pendingRow.prevTimePeriod || { hour: 0, minute: 0, second: 0, frameRate: 0 },
  };
 console.log("NEW ROW", newRow)
  // ✅ Insert new row into parent data array
 setMetaData(prev => {
  const updated = [...prev];
  const insertIndex = rowIndex >= 0 ? rowIndex + 1 : metaData.length;
  updated.splice(insertIndex, 0, newRow);
  return recalcSchedule ? recalcSchedule(updated) : updated;
});

// also update filteredData locally

 console.log("data after add", data)
  setShowAddNewModal(false);
  setPendingRow(null);
};

useEffect(() => {
  if (showUpdate && selectedRow) {
    setFormInputs({ ...selectedRow });
  }
}, [showUpdate, selectedRow]);

const handleImportPackage = (packageName) => {
  if (!packageName) return;

  const pkg = availablePackages.find(p => p.name === packageName);
  if (!pkg) return;

  const insertAfterId = selectedRow?.id || null;

  setMetaData(prev => {
    const updated = [...prev];

    let insertIndex = updated.length;
    let insertAfterRow = null;

    if (insertAfterId !== null) {
      const idx = updated.findIndex(r => String(r.id) === String(insertAfterId));
      if (idx >= 0) {
        insertIndex = idx + 1;
        insertAfterRow = updated[idx];
      }
    }

    const newRows = pkg.items.map((item, i) => ({
      id: Date.now() + Math.random(),

      name: item.name,
      type: item.type,
      duration: item.duration,

      startTime: `${selectedDate} 00:00:00`,
      endTime: `${selectedDate} 00:00:00`,

      prevTimePeriod: { hour: 0, minute: 0, second: 0, frameRate: 0 },
      prevEndTime: `${selectedDate} 00:00:00`,
      timePeriod: {
        hour: 0,
        minute: 0,
        second: 0,
        frameRate: item.fps || 25,
      },

      // ✅ ADD THESE (same as drag behavior)
      __insertIndex: insertIndex + i,
      __insertAfterId: insertAfterRow ? insertAfterRow.id : null,
      __insertAfterName: insertAfterRow ? insertAfterRow.name : null,
      prevRowType: insertAfterRow ? insertAfterRow.type : "",
    }));

    updated.splice(insertIndex, 0, ...newRows);
    return recalcSchedule ? recalcSchedule(updated) : updated;
  });

  setShowImportPackageModal(false);
};

const isPastOrNow = (startTime) => {
  if (!startTime) return false;
  const rowTime = new Date(startTime.replace(" ", "T"));
  const now = new Date();
  return rowTime <= now;
};

const isFutureRow = selectedRow && !isPastOrNow(selectedRow.startTime);

const selectedRowLocked = selectedRow && isPastOrNow(selectedRow.startTime);
const anySelectedRowLocked = selectedRows.some(id => {
  const row =
    data.find(r => r.id === id) ||
    filteredData.find(r => r.id === id);

  return row && isPastOrNow(row.startTime);
});

const isTableEmpty = filteredData.length === 0;
const hasSelection = selectedRows.length > 0 || selectedRow;

const handleUpdateRow = (updatedRow) => {
  setMetaData(prev => {
    // Replace the updated row in metaData
    const updated = prev.map(r => r.id === updatedRow.id ? updatedRow : r);

    // Recalculate all subsequent rows start/end times
    return recalcSchedule ? recalcSchedule(updated) : updated;
  });

  setShowUpdate(false);
};
  
    return (
      <div 
        ref={containerRef}
        className="datatable-container w-full h-full flex flex-col " 
        style={{
          height: fillHeight ? containerHeight : 'auto',
          
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          handleInternalRowDrop(e); // 👈 internal move
          handleDrop(e);           // 👈 existing external logic
        }}
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
        <div className="datatable-body overflow-x-auto ">

        <table
  className="datatable-table table table-hover min-w-[300px]"
   onContextMenu={(e) => {
       e.preventDefault();
       if (!isTableEmpty) return;

       setSelectedRows([]);

       // Empty table right-click → show context menu
       setSelectedRow(null); // no actual row selected
       setContextMenu({
         mouseX: e.clientX + 2,
         mouseY: e.clientY - 6,
       });
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
    data.map((row) => (
     
      <tr
        key={row.id}
        data-row-id={row.id}
        draggable
        onDragStart={(e) => handleDragStart(e, row)}
        onClick={() => {handleRowSelect(row.id); setContextMenu(null); }} // Left click select
        onContextMenu={(e) => {
         // console.log("row", row)
          e.preventDefault();
          setSelectedRows((prev) => {
            if (prev.includes(row.id)) return prev;
            return [...prev, row.id];
          });
          setSelectedRow(row);
          setContextMenu({
            mouseX: e.clientX + 2,
            mouseY: e.clientY - 6,
          });
        }}
        style={{
          backgroundColor: selectedRows.includes(row.id)
            ? "#D3D3D3" // selection gray
            : typeColors[row.type] || "white", // fallback to white
        }}
        className={selectedRows.includes(row.id) ? "bg-gray-100 cursor-pointer" : "cursor-pointer"}
      >
        <td className="px-2 w-[10px]">
          <input
            type="checkbox"
            checked={selectedRows.includes(row.id)}
            onChange={() => handleRowSelect(row.id)}
            onClick={(e) => {e.stopPropagation();    }}
          />
        </td>
        <td className="px-4 py-3">{row.id}</td>
        
        {/* ✅ Just display precomputed values */}
        <td className="px-4 py-3"> {formatDateTimeWithFrame(row.startTime, row.prevTimePeriod)}</td>
<td className="px-4 py-3">  {formatDateTimeWithFrame(row.endTime, row.timePeriod)}</td>


        <td className="px-4 py-3">{row.name}</td>
        <td className="px-4 py-3">{row.type}</td>
        <td className="px-4 py-3">{row.duration || "00:00:00:00"}</td>
        <td className="px-4 py-3">{row.isPaid ? "Yes" : "No"}</td>
      </tr>
    ))
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
    {/* Only show Update if one row is selected */}
    {selectedRows.length === 1 && selectedRow &&  !selectedRowLocked &&(
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => {
          const row = selectedRow;
          if (row) {
            setFormInputs({
              date: row.startDate || row.startTime?.split(" ")[0] || "",
              endDate: row.endDate || row.endTime?.split(" ")[0] || "",
              category: row.category || "",
              type: row.type || "",
              isCommercial: row.isCommercial || false,
              bonus: row.bonus || false,
              rateAgreementNo: row.rateAgreementNo || "",
              agency: row.agency || "",
              slug: row.slug || "",
              spotType: row.spotType || "",
              check: row.repeat || false,
              projectName: row.name || "",
              assetId: row.id || "",
              timePeriod: row.timePeriod || { hour: 0, minute: 0, second: 0, frame: 0 },
              duration: row.duration || "00:00:00:00",
            });
          }

          setContextMenu(null);
          setShowUpdate(true);
        }}
      >
        Update
      </button>
    )}

{(
  // Case 1: empty table
  (isTableEmpty && !hasSelection) ||

  // Case 2: future row selected
  (selectedRow && isFutureRow )
) && (
  <>
    <button
      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      onClick={() => {
        handleAddFile(selectedRow || { // dummy row for empty table
          id: null,
          name: "New File",
          endTime: "1970-01-01 00:00:00",
          timePeriod: { hour: 0, minute: 0, second: 0, frameRate: 0 },
          type: "PGM",
        });
        setContextMenu(null);
      }}
    >
      Add File
    </button>
    <button
  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
  onClick={() => {
    setSelectedPackageName("");
    setShowImportPackageModal(true);
    setContextMenu(null);
  }}
>
  Import Package
</button>
</>
)}
    {/* Copy / Paste / Delete only if there are selected rows */}
    {selectedRows.length > 0 && (
      <>
        <button
          onClick={handleCopyRows}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        >
          Copy
        </button>

        {clipboard && (
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              handlePaste(selectedRow?.id || null); // paste after selected row
              setContextMenu(null);
            }}
          >
            Paste
          </button>
        )}
        
        {selectedRows.length > 0 && !anySelectedRowLocked && (
        <button
          className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
          onClick={() => {
            if (selectedRows.length === 0) return;

            // Split local vs parent
            const localRowsToDelete = [];
            const parentRowsToDelete = [];

            selectedRows.forEach(id => {
              const parentRow = data.find(r => r.id === id);
              if (parentRow) parentRowsToDelete.push(parentRow);
              else {
                const localRow = filteredData.find(r => r.id === id);
                if (localRow) localRowsToDelete.push(localRow);
              }
            });

            // Remove local rows
            setFilteredData(prev => prev.filter(r => !selectedRows.includes(r.id)));

            // Remove parent rows using onDeleteRow
            if (onDeleteRow) onDeleteRow(selectedRows);

            setSelectedRows([]);
            setContextMenu(null);
          }}
        >
          Delete
        </button>
        )}
      </>
    )}
  </div>
)}


{showUpdate && (
  <UpdateSchedulerModal
    show={showUpdate}
    selectedRow={selectedRow}
    formInputs={formInputs}
    setFormInputs={setFormInputs}
    onClose={() => setShowUpdate(false)}
    onConfirm={handleUpdateRow}
  />
)}

<AddNewRowModal
  show={showAddNewModal}
  onClose={() => setShowAddNewModal(false)}
  onConfirm={handleConfirmAddFile}
  formInputs={formInputs}
  setFormInputs={setFormInputs}
  pendingRow={pendingRow}
/>
{showImportPackageModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-5 rounded shadow-lg w-80">
      <h3 className="text-lg font-semibold mb-3">Import Package</h3>

      <select
        className="form-control mb-4"
        value={selectedPackageName}
        onChange={(e) => setSelectedPackageName(e.target.value)}
      >
        <option value="">Select a package</option>
        {availablePackages.map((p, idx) => (
          <option key={idx} value={p.name}>{p.name}</option>
        ))}
      </select>

      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => setShowImportPackageModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={async () => handleImportPackage(selectedPackageName)}
        >
          Import
        </button>
      </div>
    </div>
  </div>
)}



</div>

{/* Footer stays under the table 

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

*/}

  
      
      </div>
    );
};

export default TableMeta;