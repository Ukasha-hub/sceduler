import React, { useContext, useEffect, useRef, useState } from 'react';
import TableMeta from './TableMeta';
import TableVistriaArchive from './TableVistriaArchive';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddDataModal from '../Modal/scheduler/AddDataModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable"; 
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import { HourlyAdContext } from '../../context/scheduler/HourlyAdProvider';
import axios from "axios";

import {DummyData} from "../../services/DummyData";


const API_URL = `${process.env.REACT_APP_API_URL}/api/v1/hourly-ad/`;

const Tables = () => {
  const [metaData, setMetaData] = useState([]);
  const [RazunaData, setRazunaData] = useState([]);
  const [showArchive, setShowArchive] = useState(false);
  const [isServerFilterCollapsed, setIsServerFilterCollapsed] = useState(true);
  const [loadingAPI, setLoadingAPI] = useState(true); 
   const [selectedSource, setSelectedSource] = useState('Razuna'); 
   const [filteredDataRazuna, setFilteredDataRazuna] = useState(RazunaData);

   const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  // Notification state
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Server selection states
  const [serverFilters, setServerFilters] = useState({
    primary: true,
    secondary: true,
    third: true,
    fourth: true,
  });

  useEffect(() => {
    if (selectedSource !== "Razuna") return; // only fetch for Razuna
  
    setLoadingAPI(true);
  
          // --- Real API call (commented out for now) ---
          /*
          fetch(`${process.env.REACT_APP_API_URL}/api/v1/media/?alias=Razuna`)
            .then((res) => res.json())
            .then(async (responseData) => {
              const formatted = responseData.data.map((item) => ({
                name: item.VID_FILENAME,
                id: item.VID_ID,
                duration: "-",
                status: "Okay",
                size: item.VID_SIZE_GB,
                type: item.VID_FILENAME.split("_")[0] || "Other"
              }));
        */
  
    // --- Dummy media list ---
    const responseData = DummyData;
  
    const formatted = responseData.data.map((item) => ({
      name: item.VID_FILENAME,
      id: item.VID_ID,
      createDate: item.VID_CREATE_DATE,
      duration: "-",
      status: "Okay",
      size: item.VID_SIZE_GB,
      type: item.VID_FILENAME.split("_")[0] || "Other",
    }));
  
    // --- Batch fetch function (real fetch preserved) ---
    const batchFetchMetadata = async (videos, batchSize = 20) => {
      const results = [];
      for (let i = 0; i < videos.length; i += batchSize) {
        const batch = videos.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (video) => {
            try {
              // --- Real API fetch preserved ---
              // const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/metadata/${video.id}`);
              // const meta = await res.json();
  
              // --- Mock metadata response ---
              const meta = {
                status: "success",
                data: {
                  asset_id: video.id,
                  file_url: `http://172.31.10.55:8080/razuna/raz2/dam/index.cfm?fa=c.serve_file&file_id=${video.id}&type=vid`,
                  duration_seconds: Math.floor(Math.random() * 900) + 600, // 10-25 min
                  timecode: "02:14:36:06",
                  fps: 25,
                  codec: "mpeg2video",
                  width: 1920,
                  height: 1080,
                  bitrate: null,
                },
              };
  
              const d = meta?.data || {};
              return {
                ...video,
                duration: d.timecode || "-",
                duration_seconds: d.duration_seconds || 0,
                fps: d.fps || "-",
                codec: d.codec || "-",
                width: d.width || "-",
                height: d.height || "-",
                bitrate: d.bitrate || "-",
                file_url: d.file_url || "#",
              };
            } catch (err) {
              console.error(`Metadata fetch failed for ${video.id}:`, err);
              return video;
            }
          })
        );
        results.push(...batchResults);
      }
      return results;
    };
  
    // --- CALL the batch fetch ---
    batchFetchMetadata(formatted, 20).then((withDurations) => {
      setRazunaData(withDurations);
      setFilteredDataRazuna(withDurations);
      setLoadingAPI(false);
    });
  
  }, [selectedSource]);
  
  
  

  
  
  

  

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
      const response = await fetch('http://172.16.9.98:8001/api/v1/rundown/exitlive', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
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

  const timePeriodToSeconds = (tp) => {
    return (tp.hour * 3600) + (tp.minute * 60) + tp.second;
  };

  // Takes a Date object and optional frame object
// Helper to format date + time + frame
const formatDateTimeWithFrame = (dateStr, timePeriod, w) => {
  if (!dateStr) return "--:--:--:--";
  //console.log("formatDateTimeWithFrame", dateStr, timePeriod, w)
  const date = new Date(dateStr);

  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
 const hours = pad(timePeriod.hour); // pad(0) = "00"
const minutes = pad(timePeriod.minute); // pad(0) = "00"
const seconds = pad(timePeriod.second)
  const frame = timePeriod?.frameRate != null ? pad(timePeriod.frameRate) : "00";
  //console.log("return:", `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${frame}` )
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${frame}`;
};



  // --- Move Row Logic (modified to accept insertIndex)
  const moveRow = (item, from, to, insertIndex = null, options = {}) => {
    if ((from === 'vistria' && to === 'meta') || to === 'metaCopy') {
  
     
      
  
      const idx = (typeof insertIndex === 'number') ? insertIndex : metaData.length;
      const rowsOfDate = metaData.filter(
        row => getRowDate(row) === selectedDate
      );
      
      const prevRow = rowsOfDate.length
        ? rowsOfDate[rowsOfDate.length - 1]
        : null;
  
      // Compute prevEndTimeDate safely
      let prevEndTimeDate;

if (prevRow) {
  // Take time from previous row, but FORCE selectedDate
  const [, timePart] = prevRow.endTime.split(" ");
  prevEndTimeDate = new Date(`${selectedDate}T${timePart}`);
} else {
  // No previous row → midnight of selectedDate
  prevEndTimeDate = new Date(`${selectedDate}T00:00:00`);
}
  console.log("prevRow",prevRow)
      // Compute frame-aware timePeriod
      const prevTimePeriod = prevRow?.timePeriod || { hour: 0, minute: 0, second: 0, frame: 0 };
      const timePeriod = item.timePeriod || { hour: 0, minute: 0, second: 0, frame: 0 };
  
      const tentative = {
        ...item,
        prevEndTime: formatDateTimeWithFrame(prevEndTimeDate, prevTimePeriod),
        prevTimePeriod,
        timePeriod,
        
        __insertIndex: prevRow ? prevRow.__insertIndex+1 : 0,
        __insertAfterId: prevRow ? prevRow.id : null,
        __insertAfterName: prevRow ? prevRow.name : null,
        prevRowType: prevRow? prevRow.type: "",
        
      };
      
      const MAX_SECONDS = 24 * 3600; // 86400

      // Get last meta row accumulated time
      //const lastMetaRow = metaData[metaData.length - 1];
      //const lastSeconds = lastMetaRow
     //   ? timePeriodToSeconds(lastMetaRow.timePeriod)
     //   : 0;

     // 🔹 Only rows of the CURRENT selectedDate
      const rowsOfSelectedDate = metaData.filter(
        row => getRowDate(row) === selectedDate
      );

      // 🔹 Last row of THIS date only
      const lastRowOfDate = rowsOfSelectedDate[rowsOfSelectedDate.length - 1];

      const lastSeconds = lastRowOfDate
        ? timePeriodToSeconds(lastRowOfDate.timePeriod)
        : 0;

      // Duration of dragged row
      const [h, m, s] = (item.duration || "00:00:00:00")
        .split(":")
        .map(v => parseInt(v, 10) || 0);

      const newDurationSeconds = (h * 3600) + (m * 60) + s;

      // ❌ Exceeds 24 hours → STOP
      if (lastSeconds + newDurationSeconds > MAX_SECONDS) {
        toast.error("⏰ Playlist time exceeds 24 hours. Cannot add this asset.");
        return;
      }
      
      
  
      setPendingRow(tentative);
      setFormInputs(prev => ({
        ...prev,
        date: selectedDate   // ✅ force correct date
      }));
      setShowAddDialog(true);
      return;
    }
  };
  
  

  // --- Helpers ---
  const formatDate = date => {
    const pad = n => n.toString().padStart(2, '0');
    const d = new Date(date);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // In parent: Tables.jsx
  const handleDeleteRow = (ids) => {
    setMetaData(prev => {
      const filtered = prev.filter(row => !ids.includes(row.id));
      return recalcSchedule(filtered);
    });
  
    toast.info(`${ids.length} rows deleted`);
  };

  const getRowDate = (row) => {
    return (
      row.startTime?.split(" ")[0] ||
      row.prevEndTime?.split(" ")[0] ||
      selectedDate   // ✅ final fallback
    );
  };
  
  const getMidnight = (row) =>
    new Date(`${getRowDate(row)}T00:00:00`);


  // --- NEW: recalcSchedule to recompute start/end/timePeriod/frame rates for all rows
  const recalcSchedule = (arr) => {
    const updated = arr.map(r => ({ ...r }));
  
    // 🔹 group rows by date
    const byDate = updated.reduce((acc, row) => {
      const date = getRowDate(row);
      acc[date] = acc[date] || [];
      acc[date].push(row);
      return acc;
    }, {});
  
    // 🔹 recalc EACH date independently
    Object.entries(byDate).forEach(([date, rows]) => {
      for (let i = 0; i < rows.length; i++) {
        const prev = i > 0 ? rows[i - 1] : null;
  
        const startDate = prev
          ? new Date(prev.endTime)
          : new Date(`${date}T00:00:00`);
  
        const durationStr = rows[i].duration || "00:00:00:00";
        const durationMs = computeDuration(durationStr);
        const endDate = new Date(startDate.getTime() + durationMs);
  
        const prevAccumTP = prev
          ? prev.timePeriod
          : { hour: 0, minute: 0, second: 0, frameRate: 0 };
  
        const tp = computeTimePeriod(prevAccumTP, durationStr);
  
        rows[i].startTime = formatDate(startDate);
        rows[i].endTime = formatDate(endDate);
        rows[i].timePeriod = tp;
  
        // ✅ prevEndTime is NOW date-safe
        rows[i].prevEndTime = prev
          ? formatDate(prev.endTime)
          : `${date} 00:00:00`;
  
        rows[i].prevTimePeriod = prev
          ? { ...prev.timePeriod }
          : { hour: 0, minute: 0, second: 0, frameRate: 0 };
  
        rows[i].prevFrameRate = rows[i].prevTimePeriod.frameRate;
      }
    });
  console.log("updated", updated)
    return updated;
  };
  
  



 

  // --- Pagination & Other States ---
  const [activeTab, setActiveTab] = useState('primary');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10000000000000, totalRecords: 0, totalPages: 0 });
  const [searchValue, setSearchValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'id', direction: 'asc' });

  const [selectedDate, setSelectedDate] = useState(getToday());

const handleDateChange = (date) => {
  setSelectedDate(date);

  const pageIndex = datePages.indexOf(date);
  if (pageIndex !== -1) {
    setPagination(prev => ({
      ...prev,
      currentPage: pageIndex + 1,
    }));
  }
};

  const groupByDate = (data) => {
    return data.reduce((acc, row) => {
      const date = row.startTime?.split(" ")[0]; // YYYY-MM-DD
      if (!date) return acc;
      acc[date] = acc[date] || [];
      acc[date].push(row);
      return acc;
    }, {});
  };

  const groupedByDate = groupByDate(metaData);
const datePages = Object.keys(groupedByDate).sort(); // sorted dates
const pageData = groupedByDate[selectedDate] || [];

useEffect(() => {
  setPagination(prev => ({
    ...prev,
    totalRecords: datePages.length,
    totalPages: datePages.length,
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
  slug: "",
  type: "",
  repeat: false,
  isCommercial: false,
  bonus: false,
  rateAgreementNo: "" ,
  agency: "",
  selectSpot:"",
  timePeriod: { hour: 0, minute: 0, second: 0, frame: 0 }, });

  // --- handleAddConfirm: insert pendingRow at the __insertIndex (if provided)
 const handleAddConfirm = () => {
  const item = pendingRow;
  if (!item) return;
  console.log("item", item)
  setMetaData(prev => {
    const updated = [...prev];
    const idx = (typeof item.__insertIndex === 'number') ? item.__insertIndex : updated.length;

    
     // Safely get previous row
     const rowsOfDate = updated.filter(
      row => getRowDate(row) === selectedDate
    );
    
    const prevRow = rowsOfDate.length
      ? rowsOfDate[rowsOfDate.length - 1]
      : null;
     console.log("updated from handleaddconfirm ",updated) 
     console.log("idx ",idx) 
     const pageDate = selectedDate;

    // console.log("pageDate", pageDate)
     
    // Start time = end time of previous row OR midnight
    let baseStart;

        if (prevRow) {
          // Take time from prevRow, but FORCE date from selectedDate
          const [_, timePart] = prevRow.endTime.split(" ");
          baseStart = new Date(`${selectedDate}T${timePart}`);
        } else {
          baseStart = new Date(`${selectedDate}T00:00:00`);
        }
   console.log("baseStart",baseStart)
   console.log("baseStartFormat",formatDate(baseStart))
   //console.log("prevRow.endTime",prevRow.endTime)

    // Duration to endTime
    const durationMs = computeDuration(item.duration || "00:00:00:00");
    const newEnd = new Date(baseStart.getTime() + durationMs); // <-- End time as Date

    // Previous accumulated timePeriod or zero
    const prevAccumTP = prevRow ? prevRow.timePeriod : { hour: 0, minute: 0, second: 0, frameRate: 0 };

    // Compute new accumulated timePeriod (STOPWATCH MODE)
    
    const timePeriod = computeTimePeriod(prevAccumTP, item.duration || "00:00:00:00");
    // console.log("item startDate",item.startTime)
    
    const rowToInsert = {
      ...item,
      id: Date.now(),
      startTime: formatDate(baseStart),
      endTime: formatDate(newEnd),
      duration: formInputs.duration,
      timePeriod,
      frameRate: timePeriod.frameRate,
      slug: formInputs.slug,
      rateAgreementNo: formInputs.rateAgreementNo,
      type: item.type,
      repeat: formInputs.repeat,
      agency: formInputs.agency,
      isCommercial: formInputs.isCommercial,
      bonus: formInputs.bonus,
      selectSpot:formInputs.selectSpot,
      prevEndTime: prevRow
  ? formatDate(prevRow.endTime)
  : `${selectedDate} 00:00:00`,
      prevTimePeriod: prevRow ? { ...prevRow.timePeriod } : { hour: 0, minute: 0, second: 0, frameRate: 0 },
      prevFrameRate: prevRow ? prevRow.timePeriod.frameRate : 0,
      prevRowType: prevRow? prevRow.type: "",
    };

    console.log("Inserting row", rowToInsert);

    updated.splice(idx, 0, rowToInsert);

    return recalcSchedule(updated);
  });

  // Reset formInputs
  setFormInputs({
    date: "", 
    slug: "", 
    repeat: false, 
    type: "", 
    com: false, 
    rateAgreementNo: "", 
    agency: "", 
    selectOption: "", 
    bonus: false, 
    selectSpot: ""
  });

  setShowAddDialog(false);
  setPendingRow(null);
  setFormInputs(prev => ({ ...prev, category: "", type: "", repeat: false, isCommercial: false, bonus: false }));
};

  
  const FPS = 25; // frames per second

// --- Compute timePeriod from start and end dates
function computeTimePeriod(prevTimePeriod, durationStr) {
  const FPS = 25;

  // Decompose previous accumulated time
  let totalFrames =
    (prevTimePeriod.hour * 3600 + prevTimePeriod.minute * 60 + prevTimePeriod.second) * FPS +
    (prevTimePeriod.frameRate || 0);

  // Decompose duration "HH:MM:SS:FF"
  const [h, m, s, f] = durationStr.split(':').map(n => parseInt(n, 10) || 0);
  const durationFrames = (h * 3600 + m * 60 + s) * FPS + f;

  // Add to accumulated time
  totalFrames += durationFrames;

  // Convert back to HH:MM:SS:FF
  const hour = Math.floor(totalFrames / (FPS * 3600));
  totalFrames -= hour * FPS * 3600;

  const minute = Math.floor(totalFrames / (FPS * 60));
  totalFrames -= minute * FPS * 60;

  const second = Math.floor(totalFrames / FPS);
  const frameRate = totalFrames % FPS;

  return { hour, minute, second, frameRate };
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
   //console.log("MetaData inside CSV:", metaData);
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



const [hourlyInterval, setHourlyInterval] = useState("");

// Fetch interval from API
useEffect(() => {
  const fetchHourlyInterval = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data && res.data.hourly_interval) {
        setHourlyInterval(res.data.hourly_interval);
      }
    } catch (err) {
      console.error("Failed to fetch hourly interval", err);
    }
  };
  fetchHourlyInterval();
}, []);

const parseTimeToSeconds = (timeStr) => {
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 3600 + m * 60 + s;
};

// Generate slots using HH:mm:ss interval
const generateSlots = (intervalTimeStr) => {
  const slots = [];
  const totalSeconds = 24 * 3600; // full day
  const intervalSec = parseTimeToSeconds(intervalTimeStr);

  for (let start = 0; start < totalSeconds; start += intervalSec) {
    const end = Math.min(start + intervalSec - 1, totalSeconds - 1);

    // Convert back to HH:MM:SS
    const formatTime = (sec) => {
      const h = String(Math.floor(sec / 3600)).padStart(2, "0");
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    };

    slots.push(`${formatTime(start)} - ${formatTime(end)}`);
  }

  return slots;
};



console.log("metadata:",metaData)
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
          <button
            type="button"
            className="btn btn-tool"
            onClick={() => setIsServerFilterCollapsed(prev => !prev)}
          >
            <i className={`fas ${isServerFilterCollapsed ? 'fa-plus' : 'fa-minus'}`}></i>
          </button>
          
        </div>
      </div>

      <div className="card-body" style={{ display: isServerFilterCollapsed ? 'none' : 'block' }}>
        <div className="row">
          {/* Left side (inputs) */}
          <div className="col-md-5 border-right">
  {/* Hourly Ad */}
  <div className="form-group row align-items-center mb-2">
    <label className="col-sm-3 col-form-label text-sm mb-0 " style={{ fontSize: "12px" }}>
      Hourly Ad
    </label>
    <div className="col-sm-8 pl-1">
    <select className="form-control form-control-sm">
  <option value="">Select Ad</option>
  {generateSlots(hourlyInterval).map((slot, idx) => (
    <option key={idx} value={slot}>
      {slot}
    </option>
  ))}
</select>
    </div>
  </div>

  {/* Validate + Run button in one row */}
  <div className="form-group flex flex-row align-items-center mb-1">
    <label className="col-sm-3  text-sm mb-0 pr-1" style={{ fontSize: "12px" }}>
      Validate
    </label>
    <div className="col-sm-5 pl-1 pr-1">
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Enter validation code"
      />
    </div>
    <div className="col-sm-3 pl-0">
      <button className="btn btn-warning btn-sm w-100">
        <i className="fas fa-play mr-1"></i>Run
      </button>
    </div>
  </div>

  <h6 className="text-danger text-xs mt-1 flex justify-end mb-0 mr-7">* 1100 not validated</h6>
</div>


          {/* Right side (servers) */}
          <div className="col-md-7">
            <h1 className='text-md pb-2 font-semibold'>Create Playlist</h1>
            <div className="row text-center align-items-center">
  {['primary', 'secondary', 'third', 'fourth'].map((server) => (
    <div className="col-3" key={server}>
      <div className="custom-control custom-switch d-inline-flex align-items-center justify-content-center">
        <input
          type="checkbox"
          className="custom-control-input"
          id={`${server}Server`}
          checked={serverFilters[server]}
          onChange={(e) => handleServerFilterChange(server, e.target.checked)}
        />
        <label
          className="custom-control-label text-rundown mb-0"
          htmlFor={`${server}Server`}
        >
          <div className="d-flex align-items-center justify-content-center">
            <div
              className={`server-icon-compact mr-2 ${serverFilters[server] ? 'active' : ''}`}
            >
              <i className="fas fa-server"></i>
            </div>
            <span className="font-weight-bold" style={{ fontSize: "12px" }}>
             {server.charAt(0).toUpperCase() + server.slice(1)}  Server
            </span>
          </div>
        </label>
      </div>
    </div>
  ))}
</div>


            {/* Server Buttons */}
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex justify-content-end align-items-center pt-3">
                  <div className="btn-group mr-3">
                    <button
                      className="btn btn-outline-success btn-sm mr-2"
                      onClick={handleSelectAllServers}
                    >
                      <i className="fas fa-check-double mr-1"></i>Select All
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={handleClearAllServers}
                    >
                      <i className="fas fa-times mr-1"></i>Clear All
                    </button>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={handleExitLive}>
                    <i className="fas fa-sign-out-alt mr-2"></i>Create Playlist
                  </button>
                </div>
              </div>
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
                  <div className='flex flex-row justify-start h-10 gap-3  lg:gap-7'>
                    <div className="form-group flex gap-2">
                      <label className='mt-2'>Date:</label>
                      <input
                        type="date"
                        className="form-control text-xs w-30"
                        id="fromDate"
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                      />
                    </div>
                    <div className='flex flex-row gap-2'>
                    <button className="btn btn-xs text-xs text-black bg-green-300 lw-15 h-9 p-1" onClick={() => downloadCSV(metaData)}>
   <span className='flex flex-col lg:flex-row lg:gap-1'> <FaFileCsv className='h-4'/> CSV</span>
</button>
                  
                     <button className="btn btn-xs text-xs text-black bg-red-300 w-15  h-9 p-1" onClick={() => downloadPDF()}>
                     <span className='flex flex-col lg:flex-row lg:gap-1'> <FaFilePdf className='h-4'/> PDF</span>
</button>
                    </div>
                 
                  </div>
                   
                  <div>
                  <button className="btn btn-sm btn-primary" onClick={() => setShowArchive(prev => !prev)}>{showArchive ? '+' : '-'}</button>
                  </div>
                  
                </div>
                <div className="card-body" style={{ padding: 0, height: 'calc(100vh - 220px)' }}>
                  <TableMeta
                    data={pageData}
                    metaData={metaData}  
                    onMoveRow={moveRow}
                    from="meta"
                    onSearch={handleSearch}
                    formatDateTimeWithFrame={formatDateTimeWithFrame}
                    onSort={handleSort}
                    pendingRow={pendingRow}
                    setPendingRow={     setPendingRow}
                    recalcSchedule={recalcSchedule}
                    setMetaData={ setMetaData}
                    computeTimePeriod={computeTimePeriod}
                    formatDate={formatDate}
                    computeDuration={computeDuration}
                    handleAddConfirm ={handleAddConfirm }
                    onPageChange={handlePageChange}
                    onRowClick={handleRowClick}
                     onDeleteRow={handleDeleteRow}
                    totalRecords={pagination.totalRecords}
                    currentPage={pagination.currentPage}
                    pageSize={1}
                    loading={loading}
                    searchValue={searchValue}
                    serverSide
                    fillHeight
                    selectedDate={selectedDate}
                  />
                </div>
              </div>
            </div>

            {/* Archive Table */}
            {showArchive && (
              <div style={{ flex: 1, minWidth: '200px', marginLeft: '5px' }}>
                <TableVistriaArchive RazunaData={RazunaData} setRazunaData={setRazunaData} loadingAPI={loadingAPI} setLoadingAPI={setLoadingAPI} selectedSource={selectedSource} setSelectedSource={setSelectedSource} filteredDataRazuna={filteredDataRazuna} setFilteredDataRazuna={setFilteredDataRazuna }  onMoveRow={moveRow} from="vistria" />
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