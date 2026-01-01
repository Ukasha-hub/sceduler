import React, { useEffect, useRef, useState } from "react";

import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import axios from "axios";
import dayjs from "dayjs";

const API_BASE = `${process.env.REACT_APP_API_URL}/api/v1/schedulerSettings/`;

export const SettingsScheduler = () => {
  const [formData, setFormData] = useState({
    adLimit: "",
    slot: "",
    fromDate: "",
    toDate: "",
    fromTime: "",
    toTime: "",
    type: "",
    bpCode: "",
    rateAgreement: "",
    timeBand: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tableDataState, setTableDataState] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowId: null });

  const tableRef = useRef();

   // Fetch data from API on component mount
   useEffect(() => {
    fetchSchedulerSettings();
  }, []);

  const fetchSchedulerSettings = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTableDataState(res.data);
    } catch (error) {
      console.error("Failed to fetch scheduler settings:", error);
    }
  };

  // Hide context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  const handleRowClick = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };
  

  const handleSelectAll = () => {
    if (selectedRows.length === tableDataState.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableDataState.map((row) => row.id));
    }
  };

  const handleRightClick = (e, rowId) => {
    e.preventDefault();
    
    // Get the table's bounding rectangle
    const tableRect = tableRef.current.getBoundingClientRect();
  
    setContextMenu({
      visible: true,
      x: e.clientX - tableRect.left, // relative to table
      y: e.clientY - tableRect.top,
      rowId: rowId,
    });
  
    if (!selectedRows.includes(rowId)) {
      setSelectedRows([rowId]);
    }
  };

  const handleDeleteRows = async () => {
    try {
      // Delete each selected row via API
      await Promise.all(
        selectedRows.map((id) => axios.delete(`${API_BASE}${id}`))
      );
  
      // Update local state
      setTableDataState(tableDataState.filter((row) => !selectedRows.includes(row.id)));
      setSelectedRows([]);
      setContextMenu({ ...contextMenu, visible: false });
  
      alert("Row(s) deleted!");
    } catch (error) {
      console.error("Failed to delete row(s):", error);
      alert("Failed to delete row(s)!");
    }
  };

  const handleEditRow = (rowId) => {
    const row = tableDataState.find((r) => r.id === rowId);
    if (!row) return;
  
    setFormData({
      slot: row.slot,
      type: row.Type,
      bpCode: row.bp_code || "",
      rateAgreement: row.rate_agreement || "",
      timeBand: row.time_band || "",
      fromDate: row.from_date,
      toDate: row.to_date,
      fromTime: row.from_time,
      toTime: row.to_time,
      adLimit: row.ad_limit,
    });
    setIsEditing(true);
    setSelectedRows([rowId]);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const formatTime = (time) => {
    if (!time) return null;
    return time.length === 5 ? time + ":00" : time; // "HH:mm" → "HH:mm:00"
  };

  // --- Inside your component ---
const handleAddRow = async () => {
  try {
    await axios.post(API_BASE, {
      slot: formData.slot,
      Type: formData.type,
      bp_code: formData.bpCode || null,
      rate_agreement: formData.rateAgreement || null,
      time_band: formData.timeBand || null,
      from_date: dayjs(formData.fromDate).format("YYYY-MM-DD"),
      to_date: dayjs(formData.toDate).format("YYYY-MM-DD"),
      from_time: formatTime(formData.fromTime),
      to_time: formatTime(formData.toTime),
      ad_limit: parseFloat(formData.adLimit),
    });
    alert("Row added!");
    fetchSchedulerSettings();
    resetForm();
  } catch (error) {
    console.error("Failed to add row:", error);
  }
};

const handleUpdateRow = async () => {
  try {
    await axios.put(`${API_BASE}${selectedRows[0]}`, {
      slot: formData.slot,
      Type: formData.type,
      bp_code: formData.bpCode || null,
      rate_agreement: formData.rateAgreement || null,
      time_band: formData.timeBand || null,
      from_date: dayjs(formData.fromDate).format("YYYY-MM-DD"),
      to_date: dayjs(formData.toDate).format("YYYY-MM-DD"),
      from_time: formatTime(formData.fromTime),
      to_time: formatTime(formData.toTime),
      ad_limit: parseFloat(formData.adLimit),
    });
    alert("Row updated!");
    fetchSchedulerSettings();
    resetForm();
  } catch (error) {
    console.error("Failed to update row:", error);
  }
};

const resetForm = () => {
  setFormData({
    adLimit: "",
    slot: "",
    fromDate: "",
    toDate: "",
    fromTime: "",
    toTime: "",
    type: "",
    bpCode: "",
    rateAgreement: "",
    timeBand: "",
  });
  setIsEditing(false);
  setSelectedRows([]);
};

// --- Updated form submit ---
const handleSubmit = (e) => {
  e.preventDefault();
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!timeRegex.test(formData.fromTime) || !timeRegex.test(formData.toTime)) {
    alert("Please enter time in HH:mm:ss format");
    return;
  }
  if (isEditing) {
    handleUpdateRow();
  } else {
    handleAddRow();
  }
};
  
const handleConfirmDelete = async () => {
  try {
    await Promise.all(
      selectedRows.map((id) => axios.delete(`${API_BASE}${id}`))
    );

    setTableDataState(tableDataState.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    setContextMenu({ ...contextMenu, visible: false });

  } catch (error) {
    console.error("Failed to delete row(s):", error);
  }
  setShowDeleteModal(false);
};

  
  const FloatingSelect = ({ label, value, onChange, children }) => (
    <div className="mb-4 relative">
      <select
        value={value}
        onChange={onChange}
        required
        className="
          peer block w-full  rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-9 bg-white
          focus:border-blue-500 focus:outline-none
        "
      >
        <option value="" hidden></option>
        {children}
      </select>
  
      <label
        className="
          absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75 
          bg-white px-1 text-gray-500 transition-all duration-200
          peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-500
          peer-[&:not(:placeholder-shown)]:-translate-y-3
          peer-[&:not(:placeholder-shown)]:scale-75
        "
      >
        {label}
      </label>
    </div>
  );

  
  return (
    <div className="flex lg:flex-row text-xs flex-col gap-2 justify-center">
      {/* TABLE SECTION */}
      <div className="row mt-4 w-full md:w-3/5" ref={tableRef}>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Responsive Hover Table</h3>
            </div>

            <div className="table-responsive">
              <table className="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedRows.length === tableDataState.length && tableDataState.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    
                    <th>Slot</th>
                    <th>Type</th>
                    <th>BP Code</th>
                    <th>Rate Agreement</th>
                    <th>Time Band</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Ad Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataState.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item.id)}
                      onContextMenu={(e) => handleRightClick(e, item.id)}
                      className={`cursor-pointer hover:bg-gray-100 ${
                        selectedRows.includes(item.id) ? "bg-gray-200" : ""
                      }`}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.id)}
                          onChange={() => {
                            if (selectedRows.includes(item.id)) {
                              setSelectedRows(selectedRows.filter((id) => id !== item.id));
                            } else {
                              setSelectedRows([...selectedRows, item.id]);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      
                      <td>{item.slot}</td>
                      <td>{item.Type}</td>
                      <td>{item.bp_code}</td>
                      <td>{item.rate_agreement}</td>
                      <td>{item.time_band}</td>
                      <td>{item.from_date}</td>
                      <td>{item.to_date}</td>
                      <td>{item.from_time}</td>
                      <td>{item.to_time}</td>
                      <td>{item.ad_limit}</td>
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
                    className="px-4 py-1 hover:bg-blue-100 cursor-pointer text-blue-600"
                    onClick={() => handleEditRow(contextMenu.rowId)}

                  >
                    Update
                  </li>
              
                  <li
                    className="px-4 py-1 hover:bg-red-100 cursor-pointer text-red-600"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </li>
                </ul>
              </div>
              
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SETTINGS FORM SECTION */}
      {/* SETTINGS FORM SECTION */}
<div className="card card-primary md:w-2/5 mt-4 md:mt-0">
  <div className="card-header">
    <h3 className="card-title text-white text-xs">Settings</h3>
  </div>

  <form onSubmit={handleSubmit}>
    <div className="card-body">

      <div className="flex flex-row justify-between gap-5">
       <div className="w-1/2">
        <FloatingSelect
          label="Slot"
          value={formData.slot}
          onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
          required
        >
          <option value="pick_hour">Pick Hour</option>
          <option value="off_pick_hour">OFF Pick Hour</option>
        
        </FloatingSelect>
        </div>
        <div className="w-1/2">
        <FloatingSelect
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        >
          <option value="24 Hour">24 Hour</option>
          <option value="PGM Wise">PGM Wise</option>
        </FloatingSelect>
        </div>
      </div>

      {formData.type === "PGM Wise" && (
        <>
          <div className="flex flex-row gap-5 w-full mt-2">
          <div className="mb-4 relative w-1/2">
        <input
          type="text"
          placeholder=" "
          value={formData.bpCode}
  onChange={(e) => setFormData({ ...formData, bpCode: e.target.value })}
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
          BP Code
        </label>
      </div>
      <div className="mb-4 relative w-1/2">
        <input
          type="text"
          placeholder=" "
          value={formData.rateAgreement}
  onChange={(e) => setFormData({ ...formData, rateAgreement: e.target.value })}
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
          Rate Agreement
        </label>
      </div>
          </div>

          <div className="mb-4 relative">
        <input
          type="text"
          placeholder=" "
          value={formData.timeBand}
          onChange={(e) => setFormData({ ...formData, timeBand: e.target.value })}
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
          Time Band
        </label>
      </div>
        </>
      )}

      <div className="flex flex-row gap-5 mt-2 w-full">
      <div className="mb-4 relative w-1/2">
        <input
          type="date"
          placeholder=" "
          value={formData.fromDate}
          onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
          required
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
          From date
        </label>
      </div>

      <div className="mb-4 relative w-1/2">
        <input
          type="date"
          placeholder=" "
          value={formData.toDate}
          onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
          required
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
          To Date
        </label>
      </div>
      </div>

      {/* TIME PICKER FLOATING */}
      <div className="flex flex-row gap-5 mt-2 w-full">
      <div className="relative mb-4 w-1/2">
  <input
    type="text"
    placeholder="HH:MM:SS"
    value={formData.fromTime}
    onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })}
    required
    className="
      peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-9
      focus:border-blue-500 focus:outline-none
    "
    maxLength={8}
  />
  <label
    className="
      absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75
      bg-white px-1 text-gray-500 transition-all duration-200
    "
  >
    From Time
  </label>
</div>

<div className="relative mb-4 w-1/2">
  <input
    type="text"
    placeholder="HH:MM:SS"
    value={formData.toTime}
    onChange={(e) => setFormData({ ...formData, toTime: e.target.value })}
    required
    className="
      peer block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs h-9
      focus:border-blue-500 focus:outline-none
    "
    maxLength={8}
  />
  <label
    className="
      absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75
      bg-white px-1 text-gray-500 transition-all duration-200
    "
  >
    To Time
  </label>
</div>
      </div>

      <div className="mb-4 relative">
        <input
          type="number"
          step="0.01"
          placeholder=" "
          value={formData.adLimit}
          onChange={(e) =>
            setFormData({ ...formData, adLimit: e.target.value === "" ? "" : parseFloat(e.target.value) })
          }
          required
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
          Add Limit
        </label>
      </div>

    </div>

    <div className="card-footer flex flex-row gap-2">
  <button
    type="submit"
    className="h-7 border-2 rounded-md border-blue-400 btn-primary btn-sm w-full"
  >
    {isEditing ? "Update" : "Add"}
  </button>

  {isEditing && (
    <button
      type="button"
      className="h-7 border-2 rounded-md border-gray-400 btn-secondary w-1/2 ml-1"
      onClick={resetForm}
    >
      Reset
    </button>
  )}
</div>

  </form>
</div>
{showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded shadow-lg p-5 w-80">
      <h2 className="text-sm font-semibold mb-3">Are you sure?</h2>
      <p className="text-xs mb-4">
        Do you really want to delete {selectedRows.length} selected row(s)?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-3 py-1 text-xs bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirmDelete}
          className="px-3 py-1 text-xs bg-red-600 text-white rounded"
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
