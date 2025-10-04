import React, { useEffect, useState } from 'react';
import TableMeta from '../components/TableMeta';
import TableVistriaArchive from '../components/TableVistriaArchive';
import tableData from '../services/TableData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tables = () => {
  const [metaData, setMetaData] = useState([]);
  const [vistriaData, setVistriaData] = useState(tableData);
  const [showArchive, setShowArchive] = useState(false);
  const [isServerFilterCollapsed, setIsServerFilterCollapsed] = useState(true);
  // Notification state
    const [notification, setNotification] = useState({
      show: false,
      type: '', // 'success' or 'error'
      message: ''
    });
  
  // Server selection states
    const [serverFilters, setServerFilters] = useState({
      primary: true,
      secondary: true,
      third: true,
      fourth: true,
    });

     // Handle server filter changes
  const handleServerFilterChange = (server, checked) => {
    setServerFilters((prev) => ({ ...prev, [server]: checked }));
  };

  // Handle server selection actions
  const handleSelectAllServers = () => {
    setServerFilters({
      primary: true,
      secondary: true,
      third: true,
      fourth: true,
    });
  };

  const handleClearAllServers = () => {
    setServerFilters({
      primary: false,
      secondary: false,
      third: false,
      fourth: false,
    });
  };

  const handleExitLive = async () => {
    try {
      const response = await fetch('http://172.16.9.98:8000/api/v1/rundown/exitlive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('Exit Live command sent successfully');
        setNotification({
          show: true,
          type: 'success',
          message: 'Exit Live command executed successfully!'
        });
        // Auto-hide notification after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 3000);
      } else {
        console.error('Failed to send Exit Live command');
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to execute Exit Live command. Please try again.'
        });
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 5000);
      }
    } catch (error) {
      console.error('Error sending Exit Live command:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Network error occurred. Please check your connection and try again.'
      });
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    }
  };

  // Resizable width for Meta Table
  const [metaWidth, setMetaWidth] = useState(showArchive ? 70 : 100);

  // --- Move Row Logic ---
  const moveRow = (item, from, to) => {
    const now = new Date();
  
    if (from === 'vistria' && to === 'meta') {
      setMetaData(prev => {
        if (prev.some(row => row.id === item.id)) return prev;
  
        const updatedData = [...prev];
  
        // Update previous last row
        if (updatedData.length > 0) {
          const lastIndex = updatedData.length - 1;
          const lastItem = updatedData[lastIndex];
          const endTime = formatDate(now);
          const duration = calculateDuration(lastItem.startTime, now);
  
          updatedData[lastIndex] = { ...lastItem, endTime, duration };
  
          // Instead of toast here, return both updatedData and lastItem info
          updatedData._lastEnded = { name: lastItem.name, endTime, duration };
        }
  
        // Add new row
        updatedData.push({ ...item, startTime: formatDate(now), endTime: null, duration: null });
        return updatedData;
      });
  
      // Show toast **after setState**, using the last item from previous state
      const prev = metaData;
      if (prev.length > 0) {
        const lastItem = prev[prev.length - 1];
        const endTime = formatDate(now);
        const duration = calculateDuration(lastItem.startTime, now);
        toast.info(`"${lastItem.name}" ended at ${endTime} (duration: ${duration})`);
      }
  
    } else if (from === 'meta') {
      setMetaData(prev => prev.filter(row => row.id !== item.id));
      toast.info(`Removed "${item.name}"`);
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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10000000000000,
    totalRecords: 0,
    totalPages: 0,
  });
  const [searchValue, setSearchValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'id', direction: 'asc' });

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      totalRecords: metaData.length,
      totalPages: Math.ceil(metaData.length / prev.pageSize),
    }));
  }, [metaData]);

  // --- Handlers ---
  const handleSearch = value => setSearchValue(value);
  const handleSort = (field, direction) => setSortConfig({ field, direction });
  const handlePageChange = page => setPagination(prev => ({ ...prev, currentPage: page }));
  const handleTabChange = tab => setActiveTab(tab);
  const handleRowClick = item => {
    setSelectedSchedule(item);
    setShowScheduleModal(true);
  };
  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedSchedule(null);
  };

  // --- Resizer Logic ---
  const initResize = e => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
  };

  const handleMouseMove = e => {
    const newWidth = e.clientX;
    if (newWidth < 300) return;
    if (newWidth > window.innerWidth - 200) return;
    setMetaWidth(newWidth);
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
  };

  return (
    <div>
      <section className="content " style={{ fontSize: '12px', fontWeight: 400 }}>
        <div className="container-fluid">
        <div className="row">
            <div className="col-12">
              <div
                className={`card card-outline card-warning ${
                  isServerFilterCollapsed ? "collapsed-card" : ""
                }`}
              >
                <div className="card-header">
                  <h3 className="card-title" style={{ fontSize: "12px" }}>
                    <i className="fas fa-server mr-1"></i>
                    Server Control & Live Management
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      onClick={() => setIsServerFilterCollapsed(!isServerFilterCollapsed)}
                    >
                      <i
                        className={`fas ${
                          isServerFilterCollapsed ? "fa-plus" : "fa-minus"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{ display: isServerFilterCollapsed ? "none" : "block" }}
                >
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group mb-2">
                        {/* <label className="text-rundown font-weight-bold">
                          <i className="fas fa-server mr-2"></i>
                          Server Selection
                        </label> */}
                        <div className="row mt-3">
                          <div className="col-md-6 col-lg-3 mb-2">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="primaryServer"
                                checked={serverFilters.primary}
                                onChange={(e) =>
                                  handleServerFilterChange("primary", e.target.checked)
                                }
                              />
                              <label className="custom-control-label text-rundown" htmlFor="primaryServer">
                                <div className="d-flex align-items-center">
                                  <div className={`server-icon-compact mr-2 ${serverFilters.primary ? 'active' : ''}`}>
                                    <i className="fas fa-server"></i>
                                  </div>
                                  <span className="font-weight-bold text-rundown">Primary Server</span>
                                </div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-3 mb-2">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="secondaryServer"
                                checked={serverFilters.secondary}
                                onChange={(e) =>
                                  handleServerFilterChange("secondary", e.target.checked)
                                }
                              />
                              <label className="custom-control-label text-rundown" htmlFor="secondaryServer">
                                <div className="d-flex align-items-center">
                                  <div className={`server-icon-compact mr-2 ${serverFilters.secondary ? 'active' : ''}`}>
                                    <i className="fas fa-server"></i>
                                  </div>
                                  <span className="font-weight-bold">Secondary Server</span>
                                </div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-3 mb-2">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="thirdServer"
                                checked={serverFilters.third}
                                onChange={(e) =>
                                  handleServerFilterChange("third", e.target.checked)
                                }
                              />
                              <label className="custom-control-label text-rundown" htmlFor="thirdServer">
                                <div className="d-flex align-items-center">
                                  <div className={`server-icon-compact mr-2 ${serverFilters.third ? 'active' : ''}`}>
                                    <i className="fas fa-server"></i>
                                  </div>
                                  <span className="font-weight-bold">Third Server</span>
                                </div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6 col-lg-3 mb-2">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="fourthServer"
                                checked={serverFilters.fourth}
                                onChange={(e) =>
                                  handleServerFilterChange("fourth", e.target.checked)
                                }
                              />
                              <label className="custom-control-label text-rundown" htmlFor="fourthServer">
                                <div className="d-flex align-items-center">
                                  <div className={`server-icon-compact mr-2 ${serverFilters.fourth ? 'active' : ''}`}>
                                    <i className="fas fa-server"></i>
                                  </div>
                                  <span className="font-weight-bold">Fourth Server</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex justify-content-end align-items-center pt-3 border-top">
                        <div className="btn-group mr-3">
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm text-rundown mr-2"
                            onClick={handleSelectAllServers}
                          >
                            <i className="fas fa-check-double mr-1"></i>
                            Select All
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm text-rundown"
                            onClick={handleClearAllServers}
                          >
                            <i className="fas fa-times mr-1"></i>
                            Clear All
                          </button>
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm text-rundown compact-exit-btn"
                          onClick={handleExitLive}
                        >
                          <i className="fas fa-sign-out-alt mr-2"></i>
                          Exit Live
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rundown-main-row flex flex-col lg:flex-row"  style={{  width: '100%' }}>
            {/* --- Meta Table Resizable --- */}
            <div
              style={{
                width: showArchive ? `${metaWidth}px` : '100%',
                minWidth: '300px',
                position: 'relative',
              }}
            >
              {/* Resizer Handle */}
              {showArchive && (
                <div
                  style={{
                    width: '5px',
                    cursor: 'col-resize',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                    backgroundColor: 'transparent',
                  }}
                  onMouseDown={initResize}
                />
              )}

              <div className="card  rundown-table-card">
                <div className="card-header p-2 flex flex-row justify-end">
                  <button className="btn btn-sm btn-primary" onClick={() => setShowArchive(prev => !prev)}>
                    {showArchive ? '−' : '+'}
                  </button>
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
                    serverSide={true}
                    fillHeight={true}
                  />
                </div>
              </div>
            </div>

            {/* --- Archive Table --- */}
            {showArchive && (
              <div className="" style={{ flex: 1, minWidth: '200px', marginLeft: '5px' }}>
                <TableVistriaArchive data={vistriaData} onMoveRow={moveRow} from="vistria" />
              </div>
            )}
          </div>
        </div>
      </section>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Tables;
