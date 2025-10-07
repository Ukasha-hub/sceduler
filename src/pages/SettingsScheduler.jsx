import React, { useState } from "react";
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
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  const handleRowClick = (item) => {
    // Keep full 24-hour format with seconds
    setFormData({
      slot: item.size,
      fromDate: item.startDate,
      toDate: item.endDate,
      fromTime: item.startTime, // e.g., "14:30:00"
      toTime: item.endTime,     // e.g., "16:30:00"
      adLimit: "",
    });
    setIsEditing(true);
  };

  return (
    <div className="flex lg:flex-row text-xs flex-col gap-2 justify-center">
      {/* TABLE SECTION */}
      <div className="row mt-4 w-full md:w-3/5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Responsive Hover Table</h3>
            </div>

            <div className="table-responsive">
              <table className="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slot</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item) => (
                    <tr key={item.id} onClick={() => handleRowClick(item)} className="cursor-pointer hover:bg-gray-100">
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.size}</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  id="slot"
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
                  id="type"
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                >
                  <option value="">Select type</option>
                  <option value="Slot 1">Slot 1</option>
                  <option value="Slot 2">Slot 2</option>
                  <option value="Slot 3">Slot 3</option>
                </select>
              </div>
            </div>

            <div className="flex flex-row gap-5 mt-2">
              <div className="form-group flex-1">
                <label htmlFor="fromDate">From Date</label>
                <input
                  type="date"
                  className="form-control text-xs"
                  id="fromDate"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                />
              </div>

              <div className="form-group flex-1">
                <label htmlFor="toDate">To Date</label>
                <input
                  type="date"
                  className="form-control text-xs"
                  id="toDate"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-row gap-5 mt-2">
              <div className="form-group flex-1">
                <label htmlFor="fromTime">From Time</label>
                <TimePicker
                  onChange={(value) => setFormData({ ...formData, fromTime: value })}
                  value={formData.fromTime}
                  format="HH:mm:ss"
                  disableClock={true}
                  clearIcon={null}
                />
              </div>

              <div className="form-group flex-1">
                <label htmlFor="toTime">To Time</label>
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
              <label htmlFor="adLimit">Ad Limit</label>
              <input
                type="text"
                className="form-control text-xs"
                id="adLimit"
                placeholder="Enter limit"
                value={formData.adLimit}
                onChange={(e) => setFormData({ ...formData, adLimit: e.target.value })}
              />
            </div>
          </div>

          <div className="card-footer mt-2">
            <button type="submit" className="btn btn-primary w-full">
              {isEditing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
