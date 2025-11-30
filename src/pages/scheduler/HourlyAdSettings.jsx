// HourlyAdSettings.jsx
import React, { useContext } from "react";
import { HourlyAdContext } from "../../context/scheduler/HourlyAdProvider";

const HourlyAdSettings = () => {
  const { hourlyInterval, setHourlyInterval } = useContext(HourlyAdContext);

  const handleIntervalChange = (e) => {
    setHourlyInterval(Number(e.target.value));
  };

  return (
    <div className="flex justify-center text-xs bg-gray-100 mt-3">
      <div className="card card-primary w-full lg:w-1/3">
        <div className="card-header">
          <h3 className="card-title text-white">Hourly Ad Settings</h3>
        </div>

        <form className="p-2">

          {/* Floating Select Field */}
          <div className="mb-4 relative">
            <select
              value={hourlyInterval}
              onChange={handleIntervalChange}
              placeholder=" "
              className="
                peer block w-full rounded border border-gray-300 px-2 px-2 pt-3 pb-1 text-xs h-10 bg-white
                focus:border-blue-500 focus:outline-none
              "
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

            <label
              className="
                absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75
                bg-white px-1 text-gray-500 transition-all duration-200
                peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-blue-500
                peer-placeholder-shown:top-2 peer-placeholder-shown:translate-y-0
                peer-placeholder-shown:scale-100
              "
            >
              Slot Interval
            </label>
          </div>

        </form>
      </div>
    </div>
  );
};

export default HourlyAdSettings;
