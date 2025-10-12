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
  
      // Otherwise, open modal
      setPendingRow(item);
      setShowAddDialog(true);
      return;
    }
  
    // 🟢 Step 2 — Regular removal when dragging out of meta
    {/*if (from === 'meta') {
      setMetaData(prev => prev.filter(row => row.id !== item.id));
      toast.info(`Removed "${item.name}"`);
    }*/}
    

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

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.floor((endDate - startDate) / 1000);
    const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const seconds = (diff % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
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
const [formInputs, setFormInputs] = useState({ note: '', category: '' });

const handleAddConfirm = () => {
  const now = new Date();
  const item = pendingRow;

  setMetaData(prev => {
    const updatedData = [...prev];

    if (item) {
      // Update last item's endTime/duration
      if (updatedData.length > 0) {
        const lastIndex = updatedData.length - 1;
        const lastItem = updatedData[lastIndex];
        const endTime = formatDate(now);
        const duration = calculateDuration(lastItem.startTime, now);
        
        updatedData[lastIndex] = { ...lastItem, endTime, duration };
       
      }
      
      updatedData.push({
        ...item,
        startTime: formatDate(now),
        endTime: null,
        duration: null,
       
        category: item.category || "",
        type: item.type || "",
        check: item.check || false,
      });
    }

    // ✅ Now that metaData includes the copied row, trigger CSV if needed
    console.log("Updated metaData:", updatedData);

    return updatedData;
  });

  if (metaData.length > 0) {
  const lastItem = metaData[metaData.length - 1];
  const endTime = formatDate(now);
  const duration = calculateDuration(lastItem.startTime, now);
  toast.info(`"${lastItem.name}" ended at ${endTime} (duration: ${duration})`);
}

    

  setShowAddDialog(false);
  setPendingRow(null);
};





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
                      <label>Start Date:</label>
                        <input
                          type="date"
                          className="form-control  text-xs"
                          placeholder='Start Date'
                          id="fromDate"
                          value=""
                          onChange=""
                        />
                    </div>
                   <button className="btn btn-sm btn-secondary ml-2" onClick={() => downloadCSV(metaData)}>
  CSV 
</button>
                  
                     <button className="btn btn-sm btn-secondary ml-2" onClick={() => downloadPDF()}>
  PDF
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