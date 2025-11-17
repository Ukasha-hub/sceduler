// HourlyAdSettings.jsx
import React, { useContext } from "react";
import { HourlyAdContext } from "../../context/scheduler/HourlyAdProvider";


const HourlyAdSettings = () => {
  const { hourlyInterval, setHourlyInterval } = useContext(HourlyAdContext);

  const handleIntervalChange = (e) => {
    setHourlyInterval(Number(e.target.value));
  };

  return (
    <div className="flex  justify-center text-xs bg-gray-100 mt-3">
      <div className="card card-primary w-full lg:w-1/3">
        <div className="card-header">
          <h3 className="card-title text-white">Hourly Ad Settings</h3>
        </div>
        <form className="p-2">
          <div className="form-group mb-2">
            <label>Slot Interval</label>
            <select
              value={hourlyInterval}
              onChange={handleIntervalChange}
              className="border rounded px-1 py-0.5 h-7 w-75"
            >
              <option value="10">10 Minute</option>
              <option value="30">30 Minute</option>
              <option value="60">1 Hour</option>
              <option value="120">2 Hour</option>
              <option value="180">3 Hour</option>
              <option value="240">4 Hour</option>
              <option value="360">6 Hour</option>
              <option value="480">8 Hour</option>
              <option value="720">12 Hour</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HourlyAdSettings;
