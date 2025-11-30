import React, { useEffect, useRef, useState } from "react";
import tableData from "../../services/TableData";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

export const SettingsScheduler = () => {
  const [formData, setFormData] = useState({
    adLimit: "",
    slot: "",
    fromDate: "",
    toDate: "",
    fromTime: "00:00:00",
    toTime: "00:00:00",
    type: "",
    bpCode: "",
    rateAgreement: "",
    timeBand: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tableDataState, setTableDataState] = useState(tableData);
  const [selectedRows, setSelectedRows] = useState([]);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowId: null });

  const tableRef = useRef();

  // Hide context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  const handleRowClick = (item, e) => {
    if (!selectedRows.includes(item.id)) {
      setSelectedRows([...selectedRows, item.id]);
    } else if (e.type === "click") {
      setSelectedRows(selectedRows.filter((id) => id !== item.id));
    }

    setFormData({
      slot: item.size,
      fromDate: item.startDate,
      toDate: item.endDate,
      fromTime: item.startTime,
      toTime: item.endTime,
      adLimit: "",
      type: "",
      bpCode: "",
      rateAgreement: "",
      timeBand: "",
    });
    setIsEditing(true);
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

  const handleDeleteRows = () => {
    setTableDataState(tableDataState.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    setContextMenu({ ...contextMenu, visible: false });
    alert("Row(s) deleted!"); // replace with toast if needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };


  
  const FloatingSelect = ({ label, value, onChange, children }) => (
    <div className="mb-4 relative">
      <select
        value={value}
        onChange={onChange}
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
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slot</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataState.map((item) => (
                    <tr
                      key={item.id}
                      onClick={(e) => handleRowClick(item, e)}
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
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.size}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
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
        >
          <option value="Slot 1">Slot 1</option>
          <option value="Slot 2">Slot 2</option>
          <option value="Slot 3">Slot 3</option>
        </FloatingSelect>
        </div>
        <div className="w-1/2">
        <FloatingSelect
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
          <div className="peer h-9 block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs"></div>
          <label className="
            absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75 bg-white px-1
            text-gray-500 transition-all duration-200
          ">
            From Time
          </label>

          <div className="absolute inset-0 flex items-center px-2 pt-3">
            <TimePicker
              onChange={(value) => setFormData({ ...formData, fromTime: value })}
              value={formData.fromTime}
              format="HH:mm:ss"
              disableClock={true}
              clearIcon={null}
              className="w-full text-xs"
            />
          </div>
        </div>

        <div className="relative mb-4 w-1/2">
          <div className="peer h-9 block w-full rounded border border-gray-300 px-2 pt-3 pb-1 text-xs"></div>
          <label className="
            absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75 bg-white px-1
            text-gray-500 transition-all duration-200
          ">
            To Time
          </label>

          <div className="absolute inset-0 flex items-center px-2 pt-3">
            <TimePicker
              onChange={(value) => setFormData({ ...formData, toTime: value })}
              value={formData.toTime}
              format="HH:mm:ss"
              disableClock={true}
              clearIcon={null}
              className="w-full text-xs"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder=" "
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
      <button type="submit" className="h-7 border-2 rounded-md  border-blue-400 btn-primary btn-sm w-full">
        {isEditing ? "Update" : "Add"}
      </button>
      <button
        type="button"
        className="h-7 border-2 rounded-md  border-gray-400 btn-secondary w-1/2 ml-1"
        onClick={() =>
          setFormData({
            adLimit: "",
            slot: "",
            fromDate: "",
            toDate: "",
            fromTime: "00:00:00",
            toTime: "00:00:00",
            type: "",
            bpCode: "",
            rateAgreement: "",
            timeBand: "",
          })
        }
      >
        Reset
      </button>
    </div>
  </form>
</div>
    </div>
  );
};
