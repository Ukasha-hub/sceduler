import React, { useCallback, useEffect, useState } from 'react'
import TableMeta from '../components/TableMeta'
import TableVistriaArchive from '../components/TableVistriaArchive'
import tableData from '../services/TableData';



const Tables = () => {

  const [metaData, setMetaData] = useState([]); // first 2 items
  const [vistriaData, setVistriaData] = useState(tableData); // rest

  const moveRow = (item, from, to) => {
    if (from === "vistria" && to === "meta") {
      // Copy from vistria to meta without removing from vistria
      setMetaData((prev) => {
        // prevent duplicates
        if (prev.some((row) => row.id === item.id)) return prev;
        return [...prev, item];
      });
    } else if (from === "meta") {
      // Remove the row from meta
      setMetaData((prev) => prev.filter((row) => row.id !== item.id));
      
      
    }
  };

 const [blinkStates, setBlinkStates] = useState({
     primary: ["green", "red", "green", "red"],
     secondary: ["green", "green", "red", "red"],
     third: ["red", "green", "red", "green"],
     fourth: ["green", "red", "red", "green"],
   });
 
   // Filter states
   const [filters, setFilters] = useState({
     search: "",
     date: "",
     status: "",
     type: "",
   });
 
   // Server selection states
   const [serverFilters, setServerFilters] = useState({
     primary: true,
     secondary: true,
     third: true,
     fourth: true,
   });
 
   // Active tab state
   const [activeTab, setActiveTab] = useState("primary");
 
   // Filter collapse state
   const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
   const [isServerFilterCollapsed, setIsServerFilterCollapsed] = useState(true);
 
   // Schedule info modal state
   const [selectedSchedule, setSelectedSchedule] = useState(null);
   const [showScheduleModal, setShowScheduleModal] = useState(false);
 
   // Notification state
   const [notification, setNotification] = useState({
     show: false,
     type: '', // 'success' or 'error'
     message: ''
   });
 
   // DataTable states
  
   const [loading, setLoading] = useState(false);
   const [pagination, setPagination] = useState({
     currentPage: 1,
     pageSize: 10000000000000,
     totalRecords: 0,
     totalPages: 0,
   });
   const [searchValue, setSearchValue] = useState("");
   const [sortConfig, setSortConfig] = useState({
     field: "id",
     direction: "asc",
   });
 
   // Health status state for servers
   const [healthStatus, setHealthStatus] = useState({
     primary: { database: false, scripts: { playout: false, download: false, overlay: false } },
     secondary: { database: false, scripts: { playout: false, download: false, overlay: false } },
     third: { database: false, scripts: { playout: false, download: false, overlay: false } },
     fourth: { database: false, scripts: { playout: false, download: false, overlay: false } }
   });
 
   // Fetch health status for third server
   const fetchThirdServerHealth = async () => {
     try {
       const response = await fetch('http://172.16.9.98:8000/api/v1/health/server3/health');
       if (response.ok) {
         const healthData = await response.json();
         setHealthStatus(prev => ({
           ...prev,
           third: {
             database: healthData.database,
             scripts: {
               playout: healthData.scripts.playout,
               download: healthData.scripts.download,
               overlay: healthData.scripts.overlay
             }
           }
         }));
       }
     } catch (error) {
       console.error('Error fetching third server health:', error);
     }
   };
 
   // Convert health status to blink states
   const updateBlinkStatesFromHealth = useCallback(() => {
     setBlinkStates(prev => ({
       ...prev,
       third: [
         // Index 0: S and P both use playout status (they share the same index in the current code)
         healthStatus.third.scripts.playout ? "green" : "red",
         // Index 1: D uses download status
         healthStatus.third.scripts.download ? "green" : "red",
         // Index 2: O uses overlay status  
         healthStatus.third.scripts.overlay ? "green" : "red",
         // Index 3: DB uses database status
         healthStatus.third.database ? "green" : "red"
       ]
     }));
   }, [healthStatus.third]);
 
   // Fetch data from server
  
 
   // Handle search
   const handleSearch = useCallback((value) => {
     setSearchValue(value);
     setPagination((prev) => ({ ...prev, currentPage: 1 }));
   }, []);
 
   // Handle sorting
   const handleSort = useCallback((field, direction) => {
     setSortConfig({ field, direction });
     setPagination((prev) => ({ ...prev, currentPage: 1 }));
   }, []);
 
   // Handle page change
   const handlePageChange = useCallback((page) => {
     setPagination((prev) => ({ ...prev, currentPage: page }));
   }, []);
 
   // Handle tab change
   const handleTabChange = useCallback((tab) => {
     setActiveTab(tab);
     setPagination((prev) => ({ ...prev, currentPage: 1 }));
     setSearchValue("");
   }, []);
 
   // Handle row click to show schedule info
   const handleRowClick = useCallback((item) => {
     setSelectedSchedule(item);
     setShowScheduleModal(true);
   }, []);
 
   // Close schedule modal
   const closeScheduleModal = () => {
     setShowScheduleModal(false);
     setSelectedSchedule(null);
   };
 
   // Handle filter changes
   const handleFilterChange = (field, value) => {
     setFilters((prev) => ({ ...prev, [field]: value }));
     setPagination((prev) => ({ ...prev, currentPage: 1 }));
   };
 
   // Handle server filter changes
   const handleServerFilterChange = (server, checked) => {
     setServerFilters((prev) => ({ ...prev, [server]: checked }));
   };
 
   // Handle Exit Live action
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
 
   // Handle form submission
   
   // Clear filters
   const clearFilters = () => {
     setFilters({
       search: "",
       date: "",
       status: "",
       type: "",
     });
     setSearchValue("");
     setPagination((prev) => ({ ...prev, currentPage: 1 }));
   };
 
   // Fetch data when dependencies change
  
 
   // Get badge color based on type
   const getBadgeColor = (type) => {
     switch (type) {
       case "Live":
         return "badge-live";
       case "Recorded":
         return "badge-recorded";
       case "Scheduled":
         return "badge-scheduled";
       case "Ready":
         return "badge-ready";
       case "red":
         return "badge-danger"; // Red badge for red type
       default:
         return "bg-secondary";
     }
   };
 
   // Get row class name for styling
   const getRowClassName = (item) => {
     if (item.type === "red") {
       return "red-row";
     }
     
     // Status-based row coloring
     switch (item.status) {
       case "Running":
         return "running-row"; // Reddish
       case "Played":
         return "played-row"; // Ash type
       case "Upcoming":
         return "upcoming-row"; // Yellowish
       default:
         return "";
     }
   };
 
   // Define table columns
   const columns = [
     {
       key: "id",
       title: "#",
       width: "60px",
       sortable: true,
     },
     {
       key: "type",
       title: "Type",
       width: "100px",
       sortable: true,
       render: (value) => {
         let badgeClass = getBadgeColor(value);
         if (value && value.toUpperCase().startsWith("LIVE")) {
           badgeClass = "badge-live";
         }
         return <span className={`badge ${badgeClass}`}>{value}</span>;
       },
     },
     {
       key: "date",
       title: "Date",
       width: "110px",
       sortable: true,
     },
     {
       key: "programme",
       title: "Programme",
       width: "40%",
       sortable: true,
     },
     {
       key: "duration",
       title: "Duration",
       width: "100px",
       sortable: true,
     },
     {
       key: "status",
       title: "Status",
       width: "100px",
       sortable: true,
       render: (value) => {
         let badgeClass = "";
         if (value === "Running") badgeClass = "badge-live";
         else if (value === "Upcoming") badgeClass = "badge-scheduled";
         else if (value === "Played") badgeClass = "badge-ready";
         else badgeClass = "badge-info";
         return <span className={`badge ${badgeClass}`}>{value}</span>;
       },
     },
   ];
 
   
 
   // Fetch third server health status initially and every 30 seconds
   useEffect(() => {
     fetchThirdServerHealth(); // Initial fetch
     const healthInterval = setInterval(fetchThirdServerHealth, 30000); // Every 30 seconds
     return () => clearInterval(healthInterval);
   }, []);
 
   // Update blink states when health status changes
   useEffect(() => {
     updateBlinkStatesFromHealth();
   }, [updateBlinkStatesFromHealth]);
 
   return (
     <div>
       {/* Content Header (Page header) */}
       {}
 
       {/* Main content */}
       <section
         className="content mt-3"
         style={{ fontSize: "12px", fontWeight: 400 }}
       >
         <div className="container-fluid">
           {/* Filter Section */}
           {}
 
           {/* Server Control Section */}
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
 
           {/* Main Content: Table and Server Status */}
           <div className="row rundown-main-row">
             {/* Table Section */}
             <div className="col-md-9">
               <div className="card rundown-table-card">
                 <div className="card-header p-2">
                   <ul className="nav nav-pills">
                     <li className="nav-item">
                       <a
                         className={`nav-link ${
                           activeTab === "primary" ? "active" : ""
                         }`}
                         href="#primary"
                         onClick={(e) => {
                           e.preventDefault();
                           handleTabChange("primary");
                         }}
                       >
                         Primary Server
                       </a>
                     </li>
                     <li className="nav-item">
                       <a
                         className={`nav-link ${
                           activeTab === "secondary" ? "active" : ""
                         }`}
                         href="#secondary"
                         onClick={(e) => {
                           e.preventDefault();
                           handleTabChange("secondary");
                         }}
                       >
                         Secondary Server
                       </a>
                     </li>
                     <li className="nav-item">
                       <a
                         className={`nav-link ${
                           activeTab === "third" ? "active" : ""
                         }`}
                         href="#third"
                         onClick={(e) => {
                           e.preventDefault();
                           handleTabChange("third");
                         }}
                       >
                         Third Server
                       </a>
                     </li>
                     <li className="nav-item">
                       <a
                         className={`nav-link ${
                           activeTab === "fourth" ? "active" : ""
                         }`}
                         href="#fourth"
                         onClick={(e) => {
                           e.preventDefault();
                           handleTabChange("fourth");
                         }}
                       >
                         Fourth Server
                       </a>
                     </li>
                   </ul>
                 </div>
                 {/* /.card-header */}
                 <div className="card-body" style={{ padding: "0", height: "calc(100vh - 220px)" }}>
                   <div className="tab-content" style={{ height: "100%" }}>
                     <div className="server-tab-content" style={{ height: "100%" }}>
                     <TableMeta data={metaData} onMoveRow={moveRow} from="meta"
                        columns={columns}
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
                        getRowClassName={getRowClassName}
                        fillHeight={true}/>
        </div>
        {/* 4 parts out of 10 */}
        <div className="lg:col-span-4">
                     </div>
                   </div>
                 </div>
                 {/* /.card-body */}
               </div>
             </div>
 
             {/* Server Status Section */}
             <div className="col-md-3">
               <div className="row">
                 <div className="col-md-12">
                   <div className="card card-info">
                     <div className="card-header">
                       <h3 className="card-title text-white text-rundown">
                         <i className="fas fa-signal mr-1"></i>
                         Program Status
                       </h3>
                     </div>
                     <div className="card-body">
                       <div className="row">
                         <div className="col-md-6">
                           <div className="form-group">
                             <i className="fas fa-video mr-1"></i>
                             <label>Running Program</label>
                             <input
                               type="text"
                               className="form-control form-control-sm"
                               readOnly
                             />
                           </div>
                         </div>
                         <div className="col-md-6">
                           <div className="form-group">
                             <i className="fas fa-stopwatch mr-1"></i>
                             <label>Remaining Time</label>
                             <input
                               type="text"
                               className="form-control form-control-sm"
                               readOnly
                             />
                           </div>
                         </div>
                       </div>
                     </div>
                     {/* /.card-body */}
                   </div>
                 </div>
                 <TableVistriaArchive data={vistriaData} onMoveRow={moveRow} from="vistria" />
               </div>
             </div>
           </div>
         </div>
       </section>
 
       {/* Schedule Info Modal */}
       {showScheduleModal && selectedSchedule && (
         <div
           className="modal fade show"
           style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
         >
           <div className="modal-dialog modal-lg">
             <div className="modal-content">
               <div className="modal-header">
                 <h4 className="modal-title text-rundown">
                   <i className="fas fa-calendar-alt mr-2"></i>
                   Schedule Details
                 </h4>
                 <button
                   type="button"
                   className="close"
                   onClick={closeScheduleModal}
                 >
                   <span>&times;</span>
                 </button>
               </div>
               <div className="modal-body text-rundown">
                 <div className="row">
                   <div className="col-md-12">
                     <div className="card card-outline card-primary">
                       
                       <div className="card-body">
                         <table className="table table-borderless">
                           <tbody>
                             <tr>
                               <td>
                                 <strong>ID:</strong>
                               </td>
                               <td>{selectedSchedule.id}</td>
                             </tr>
                             <tr>
                               <td>
                                 <strong>Programme:</strong>
                               </td>
                               <td>{selectedSchedule.programme}</td>
                             </tr>
                             <tr>
                               <td>
                                 <strong>Type:</strong>
                               </td>
                               <td>
                                 <span
                                   className={`badge ${getBadgeColor(
                                     selectedSchedule.type
                                   )}`}
                                 >
                                   {selectedSchedule.type}
                                 </span>
                               </td>
                             </tr>
                             <tr>
                               <td>
                                 <strong>Date:</strong>
                               </td>
                               <td>{selectedSchedule.date}</td>
                             </tr>
                             <tr>
                               <td>
                                 <strong>Duration:</strong>
                               </td>
                               <td>{selectedSchedule.duration}</td>
                             </tr>
                             <tr>
                               <td>
                                 <strong>Status:</strong>
                               </td>
                               <td>
                                 <span className="badge badge-info">
                                   {selectedSchedule.status}
                                 </span>
                               </td>
                             </tr>
                             <tr>
                               <td>
                                 <strong>Server:</strong>
                               </td>
                               <td>
                                 <span className="badge badge-secondary">
                                   {selectedSchedule.server}
                                 </span>
                               </td>
                             </tr>
                           </tbody>
                         </table>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
              
             </div>
           </div>
         </div>
       )}
 
       {/* Notification Popup */}
       {notification.show && (
         <div
           className="modal fade show"
           style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
         >
           <div className="modal-dialog modal-sm modal-dialog-centered">
             <div className="modal-content">
               <div className={`modal-header ${notification.type === 'success' ? 'bg-success' : 'bg-danger'}`}>
                 <h4 className="modal-title text-white">
                   <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i>
                   {notification.type === 'success' ? 'Success' : 'Error'}
                 </h4>
                 <button
                   type="button"
                   className="close text-white"
                   onClick={() => setNotification({ show: false, type: '', message: '' })}
                 >
                   <span>&times;</span>
                 </button>
               </div>
               <div className="modal-body text-center">
                 <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-danger'} border-0`}>
                   <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-times-circle'} fa-3x mb-3`}></i>
                   <p className="mb-0 font-weight-bold">
                     {notification.message}
                   </p>
                 </div>
               </div>
               <div className="modal-footer justify-content-center">
                 <button
                   type="button"
                   className={`btn ${notification.type === 'success' ? 'btn-success' : 'btn-danger'}`}
                   onClick={() => setNotification({ show: false, type: '', message: '' })}
                 >
                   <i className="fas fa-check mr-1"></i>
                   OK
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
}

export default Tables
