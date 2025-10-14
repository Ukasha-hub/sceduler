import React, { useEffect, useRef, useState } from 'react';
import TableMeta from '../components/TableMeta';
import TableVistriaArchive from '../components/TableVistriaArchive';
import tableData from '../services/TableData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddDataModal from './AddDataModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable"; 
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

const Tables = () => {
  const [metaData, setMetaData] = useState([]);
  const [vistriaData, setVistriaData] = useState(tableData);
  const [showArchive, setShowArchive] = useState(false);
  const [isServerFilterCollapsed, setIsServerFilterCollapsed] = useState(true);

  // Notification state
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Server selection states
  const [serverFilters, setServerFilters] = useState({
    primary: true,
    secondary: true,
    third: true,
    fourth: true,
  });

  const handleServerFilterChange = (server, checked) => {
    setServerFilters((prev) => ({ ...prev, [server]: checked }));
  };

  const handleSelectAllServers = () => setServerFilters({
    primary: true,
    secondary: true,
    third: true,
    fourth: true,
  });

  const handleClearAllServers = () => setServerFilters({
    primary: false,
    secondary: false,
    third: false,
    fourth: false,
  });

  const handleExitLive = async () => {
    try {
      const response = await fetch('http://172.16.9.98:8000/api/v1/rundown/exitlive', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (response.ok) {
        setNotification({ show: true, type: 'success', message: 'Exit Live command executed successfully!' });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
      } else {
        setNotification({ show: true, type: 'error', message: 'Failed to execute Exit Live command. Please try again.' });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
      }
    } catch (error) {
      setNotification({ show: true, type: 'error', message: 'Network error occurred. Please check your connection and try again.' });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    }
  };

  
  
  const computeDuration = (durationStr) => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(p => parseInt(p, 10) || 0);
    const [hours, minutes, seconds] = parts;
    return ((hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)) * 1000;
  };
  // --- Move Row Logic ---
  const moveRow = (item, from, to) => {
    const now = new Date();
  
    // 🟡 Step 1 — Handle drag from vistria → meta
    if (from === 'vistria' && to === 'meta') {
      // ✅ If already exists, skip modal and notify
      const alreadyExists = metaData.some(row => row.id === item.id);
      if (alreadyExists) {
        toast.info(`"${item.name}" is already in the Meta table`);
        return;
      }
  
      const prevRow = metaData[metaData.length - 1];
      const prevEndTime = prevRow 
    ? new Date(prevRow.endTime) 
    : new Date(new Date().setHours(0, 0, 0, 0));
      const newEndTime = addTimePeriod(prevEndTime, computeDuration(item.duration));
      
      const newPendingRow = {
        ...item,
        prevEndTime: formatDate(prevEndTime),
        prevTimePeriod: prevRow?.timePeriod || computeTimePeriod(prevEndTime, newEndTime),
        prevFrameRate: prevRow?.frameRate || 0,
        
      };
     // console.log(prevTimePeriod)
      setPendingRow(newPendingRow);
      

  console.log("previous row endTime", prevEndTime)
  console.log("new row endTime", newEndTime)
   
  setFormInputs({
    ...formInputs,
   
  });

  setShowAddDialog(true);
  return;
    }
  
    // 🟢 Step 2 — Regular removal when dragging out of meta
    {/*if (from === 'meta') {
      setMetaData(prev => prev.filter(row => row.id !== item.id));
      toast.info(`Removed "${item.name}"`);
    }*/}
   
    if (to === null) {
      // Delete operation
      setMetaData(prev => prev.filter(r => r.id !== item.id));
      toast.info(`Deleted "${item.name}"`);
      return;
    }
    

     if (to === "metaCopy") {
    setMetaData(prev => [...prev, item]);
    toast.success(`"${item.name}" copied to Meta`);
    return;
  }

  };

  // --- Helpers ---
  const formatDate = date => {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

 

  // --- Pagination & Other States ---
  const [activeTab, setActiveTab] = useState('primary');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10000000000000, totalRecords: 0, totalPages: 0 });
  const [searchValue, setSearchValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'id', direction: 'asc' });

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      totalRecords: metaData.length,
      totalPages: Math.ceil(metaData.length / prev.pageSize),
    }));
  }, [metaData]);

  const handleSearch = value => setSearchValue(value);
  const handleSort = (field, direction) => setSortConfig({ field, direction });
  const handlePageChange = page => setPagination(prev => ({ ...prev, currentPage: page }));
  const handleTabChange = tab => setActiveTab(tab);
  const handleRowClick = item => { setSelectedSchedule(item); setShowScheduleModal(true); };
  const closeScheduleModal = () => { setShowScheduleModal(false); setSelectedSchedule(null); };

  // --- Resizer Logic ---
  const metaRef = useRef(null);
  const metaWidthRef = useRef(window.innerWidth > 1024 ? 710 : 310); // initial width

  const initResize = (e) => {
    e.preventDefault();
    document.body.style.userSelect = 'none';
    const startX = e.clientX;
    const startWidth = metaWidthRef.current;

    const onMouseMove = (e) => {
      const delta = e.clientX - startX;
      const newWidth = startWidth + delta;
      if (newWidth >= 300 && newWidth <= window.innerWidth - 200) {
        metaWidthRef.current = newWidth;
        if (metaRef.current) metaRef.current.style.width = `${newWidth}px`;
      }
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResize);
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResize);
  };

  const [showAddDialog, setShowAddDialog] = useState(false);
const [pendingRow, setPendingRow] = useState(null);
const [formInputs, setFormInputs] = useState({  date: new Date().toISOString().split("T")[0],
  note: "",
  category: "",
  type: "",
  repeat: false,
  isCommercial: false,
  bonus: false,
  timePeriod: { hour: 0, minute: 0, second: 0, frame: 0 }, });

  const handleAddConfirm = () => {
    const item = pendingRow;
    if (!item) return;
  
    setMetaData(prev => {
      const updatedData = [...prev];
  
      // Compute startTime
      const newStartTime = updatedData.length > 0
        ? new Date(updatedData[updatedData.length - 1].endTime) // start after previous row
        : new Date(new Date().setHours(0, 0, 0, 0)); // first row: midnight
  
      // Compute endTime = startTime + item.duration
      const durationParts = item.duration.split(':'); // assuming "HH:MM:SS"
      const durationMs = (
        (+durationParts[0] || 0) * 3600 +
        (+durationParts[1] || 0) * 60 +
        (+durationParts[2] || 0)
      ) * 1000;
  
      const newEndTime = new Date(newStartTime.getTime() + durationMs);
  
      // Compute timePeriod for this row (start → end)
      const timePeriod = updatedData.length === 0
        ? { hour: 0, minute: 0, second: 0, frame: 0 } // first row
        : computeTimePeriod(newStartTime, newEndTime); // function to convert diff to object
  
        updatedData.push({
          ...item,
          startTime: formatDate(newStartTime),
          endTime: formatDate(newEndTime),
          duration: item.duration,
          timePeriod, // this row's timePeriod
          frameRate: item.frameRate, // compute only for THIS row
          category: formInputs.category,
          type: item.type,
          repeat: formInputs.repeat,
          isCommercial: formInputs.isCommercial,
          bonus: formInputs.bonus,
          prevFrameRate: updatedData.length > 0 ? updatedData[updatedData.length - 1].frameRate : 0 // preserve previous row's frameRate
        });
  
      return updatedData;
    });
  
    setShowAddDialog(false);
    setPendingRow(null);
    setFormInputs(prev => ({ ...prev, category: "", type: "", repeat: false, isCommercial: false, bonus: false }));
  };
  
  const FPS = 25; // frames per second

// --- Compute timePeriod from start and end dates
function computeTimePeriod(start, end) {
  let diffMs = end - start;
  let totalFrames = Math.round(diffMs / (1000 / FPS)); // total frames

  const hour = Math.floor(totalFrames / (FPS * 3600));
  totalFrames -= hour * FPS * 3600;

  const minute = Math.floor(totalFrames / (FPS * 60));
  totalFrames -= minute * FPS * 60;

  const second = Math.floor(totalFrames / FPS);
  const frame = totalFrames % FPS;

  const frameRate = ((hour * 3600 + minute * 60 + second) * FPS) + frame; // total frames

  return { hour, minute, second, frame, frameRate };
}

// --- Add a period to a date
function addTimePeriod(date, period = { hour: 0, minute: 0, second: 0, frame: 0 }) {
  const totalMs =
    ((period.hour || 0) * 3600 + (period.minute || 0) * 60 + (period.second || 0)) * 1000 +
    (period.frame || 0) * (1000 / FPS);

  return new Date(new Date(date).getTime() + totalMs);
}



const handleAddClick = (item) => {
  setFormInputs({
    ...formInputs,
    date: item.startDate || "",     // populate date
    endDate: item.endDate || "",    // populate end date
    category: "",                   // keep others blank for manual input
    type: "",
    check: false,
  });
  setPendingRow(item); // store item so Project Name & Asset ID show
  setShowAddDialog(true);
};

// --- Helper to download CSV ---
const downloadCSV = (data = metaData) => {
   console.log("MetaData inside CSV:", metaData);
  if (!data || !Array.isArray(data) || data.length === 0) {
    toast.info("No data available to download.");
    return;
  }

  const headers = Object.keys(data[0]);
  if (headers.length === 0) return;

  const csvRows = [];
  csvRows.push(headers.join(','));

  data.forEach(row => {
    const values = headers.map(header => {
      let val = row[header] ?? '';
      if (typeof val === 'string') val = `"${val.replace(/"/g, '""')}"`;
      return val;
    });
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meta_table_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadPDF = (data = metaData) => {
  if (!data || data.length === 0) {
    toast.info("No data available to download.");
    return;
  }

  const doc = new jsPDF();

  // Optional: add title
  doc.setFontSize(14);
  doc.text("Meta Table Export", 14, 15);

  // Prepare table
  const headers = Object.keys(data[0]);

  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: data.map(row => headers.map(h => row[h] ?? '')),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [220, 220, 220] },
  });

  doc.save(`meta_table_${new Date().toISOString().slice(0,10)}.pdf`);
};

const getToday = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
};


  return (
    <div>
      <section className="content" style={{ fontSize: '12px', fontWeight: 400 }}>
        <div className="container-fluid">
          {/* Server Controls */}
          <div className="row">
            <div className="col-12">
              <div className={`card card-outline card-warning ${isServerFilterCollapsed ? 'collapsed-card' : ''}`}>
                <div className="card-header">
                  <h3 className="card-title" style={{ fontSize: "12px" }}>
                    <i className="fas fa-server mr-1"></i> Server Control & Live Management
                  </h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" onClick={() => setIsServerFilterCollapsed(prev => !prev)}>
                      <i className={`fas ${isServerFilterCollapsed ? 'fa-plus' : 'fa-minus'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="card-body" style={{ display: isServerFilterCollapsed ? 'none' : 'block' }}>
                  <div className="row">
                    {['primary', 'secondary', 'third', 'fourth'].map((server, i) => (
                      <div className="col-md-6 col-lg-3 mb-2" key={server}>
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={`${server}Server`}
                            checked={serverFilters[server]}
                            onChange={(e) => handleServerFilterChange(server, e.target.checked)}
                          />
                          <label className="custom-control-label text-rundown" htmlFor={`${server}Server`}>
                            <div className="d-flex align-items-center">
                              <div className={`server-icon-compact mr-2 ${serverFilters[server] ? 'active' : ''}`}>
                                <i className="fas fa-server"></i>
                              </div>
                              <span className="font-weight-bold">{server.charAt(0).toUpperCase() + server.slice(1)} Server</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex justify-content-end align-items-center pt-3 border-top">
                        <div className="btn-group mr-3">
                          <button className="btn btn-outline-success btn-sm mr-2" onClick={handleSelectAllServers}><i className="fas fa-check-double mr-1"></i>Select All</button>
                          <button className="btn btn-outline-secondary btn-sm" onClick={handleClearAllServers}><i className="fas fa-times mr-1"></i>Clear All</button>
                        </div>
                        <button className="btn btn-danger btn-sm" onClick={handleExitLive}><i className="fas fa-sign-out-alt mr-2"></i>Exit Live</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="rundown-main-row flex flex-col lg:flex-row w-full">
            {/* Meta Table */}
            <div
              ref={metaRef}
              style={{ width: showArchive ? `${metaWidthRef.current}px` : '100%', minWidth: '300px', position: 'relative' }}
            >
              {showArchive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0,
                    width: '10px',
                    cursor: 'col-resize',
                    zIndex: 9999,
                    //borderLeft: '1px solid rgba(0,0,0,0.1)',
                  }}
                  onMouseDown={initResize}
                />
              )}
              <div className="card rundown-table-card justify-center">
                <div className="flex justify-between items-center bg-gray-100 border-b px-3 py-1">
                  <div className='flex flex-row justify-start gap-3'>
                    <div className="form-group flex gap-0">
                      <label>Date:</label>
                      <input
                        type="date"
                        className="form-control text-xs"
                        id="fromDate"
                        defaultValue={getToday()}
                      />
                    </div>
                   <button className="btn btn-xs text-xs text-black bg-green-300 h-9 p-1" onClick={() => downloadCSV(metaData)}>
  <FaFileCsv /> CSV
</button>
                  
                     <button className="btn btn-xs text-xs text-black bg-red-300 h-9 p-1" onClick={() => downloadPDF()}>
                     <FaFilePdf />PDF
</button>
                  </div>
                   
                  <div>
                  <button className="btn btn-sm btn-primary" onClick={() => setShowArchive(prev => !prev)}>{showArchive ? '−' : '+'}</button>
                  </div>
                  
                </div>
                <div className="card-body" style={{ padding: 0, height: 'calc(100vh - 220px)' }}>
                  <TableMeta
                    data={metaData}
                    onMoveRow={moveRow}
                    from="meta"
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onPageChange={handlePageChange}
                    onRowClick={handleRowClick}
                    totalRecords={pagination.totalRecords}
                    currentPage={pagination.currentPage}
                    pageSize={pagination.pageSize}
                    loading={loading}
                    searchValue={searchValue}
                    serverSide
                    fillHeight
                  />
                </div>
              </div>
            </div>

            {/* Archive Table */}
            {showArchive && (
              <div style={{ flex: 1, minWidth: '200px', marginLeft: '5px' }}>
                <TableVistriaArchive data={vistriaData} onMoveRow={moveRow} from="vistria" />
              </div>
            )}
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick draggable pauseOnHover />
      {showAddDialog && (
  <AddDataModal
  show={showAddDialog}
  onClose={() => setShowAddDialog(false)}
  onConfirm={handleAddConfirm}
  formInputs={formInputs}
  setFormInputs={setFormInputs}
  pendingRow={pendingRow}
/>

)}
    </div>
  );
};

export default Tables;