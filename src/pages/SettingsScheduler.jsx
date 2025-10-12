import React, { useEffect, useRef, useState } from "react";
import tableData from "../services/TableData";
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
      <div className="card card-primary md:w-2/5 mt-4 md:mt-0">
        <div className="card-header">
          <h3 className="card-title text-white text-xs">Settings</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="flex flex-row gap-5">
              <div className="form-group flex-1">
                <label>Slot</label>
                <select
                  className="form-control text-xs"
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                >
                  <option value="">Select slot</option>
                  <option value="Slot 1">Slot 1</option>
                  <option value="Slot 2">Slot 2</option>
                  <option value="Slot 3">Slot 3</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Type</label>
                <select
                  className="form-control text-xs"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">Select type</option>
                  <option value="24 Hour">24 Hour</option>
                  <option value="PGM Wise">PGM Wise</option>
                </select>
              </div>
            </div>

            {formData.type === "PGM Wise" && (
              <>
                <div className="flex flex-row gap-4 mt-2">
                  <div className="form-group flex-1">
                    <label>Bp Code</label>
                    <input
                      type="text"
                      className="form-control text-xs"
                      value={formData.bpCode}
                      onChange={(e) => setFormData({ ...formData, bpCode: e.target.value })}
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label>Rate Agreement</label>
                    <input
                      type="text"
                      className="form-control text-xs"
                      value={formData.rateAgreement}
                      onChange={(e) => setFormData({ ...formData, rateAgreement: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label>Time Band</label>
                  <input
                    type="text"
                    className="form-control text-xs"
                    value={formData.timeBand}
                    onChange={(e) => setFormData({ ...formData, timeBand: e.target.value })}
                  />
                </div>
              </>
            )}

            <div className="flex flex-row gap-5 mt-2">
              <div className="form-group flex-1">
                <label>From Date</label>
                <input
                  type="date"
                  className="form-control text-xs"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                />
              </div>

              <div className="form-group flex-1">
                <label>To Date</label>
                <input
                  type="date"
                  className="form-control text-xs"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-row gap-5 mt-2">
              <div className="form-group flex-1">
                <label>From Time</label>
                <TimePicker
                  onChange={(value) => setFormData({ ...formData, fromTime: value })}
                  className="form-control text-xs"
                  value={formData.fromTime}
                  format="HH:mm:ss"
                  disableClock={true}
                  clearIcon={null}
                />
              </div>

              <div className="form-group flex-1">
                <label>To Time</label>
                <TimePicker
                  onChange={(value) => setFormData({ ...formData, toTime: value })}
                  className="form-control text-xs"
                  value={formData.toTime}
                  format="HH:mm:ss"
                  disableClock={true}
                  clearIcon={null}
                />
              </div>
            </div>

            <div className="form-group mt-2">
              <label>Ad Limit</label>
              <input
                type="text"
                className="form-control text-xs"
                value={formData.adLimit}
                onChange={(e) => setFormData({ ...formData, adLimit: e.target.value })}
              />
            </div>
          </div>

          <div className="card-footer flex flex-row gap-2">
            <button type="submit" className="btn btn-primary btn-sm w-full">
              {isEditing ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="btn btn-secondary w-1/2 ml-1"
              onClick={() =>
                setFormData({
                  adLimit: "",
                  slot: "",
                  fromDate: "",
                  toDate: "",
                  fromTime: "00:00:00",
                  toTime: "00:00:00",
                  type:"",
                  bpCode:"",
                  rateAgreement:"",
                  timeBand:"",
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
