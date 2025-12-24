import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/v1/hourly-ad/`;

const HourlyAdSettings = () => {
  const [rawMinutes, setRawMinutes] = useState("");  // user typed value
  const [hourlyInterval, setHourlyInterval] = useState("01:00:00");

  useEffect(() => {
    fetchInterval();
  }, []);

  const fetchInterval = async () => {
    try {
      const res = await axios.get(API_URL);
      const interval = res.data.hourly_interval || "01:00:00";
      setHourlyInterval(interval);

      // Convert HH:MM:SS → float minutes for display
      const [h, m, s] = interval.split(":").map(Number);
      const floatVal = (h * 60) + m + s / 60;

      setRawMinutes(floatVal.toString());
    } catch (err) {
      console.error(err);
      alert("Failed to load hourly ad settings");
    }
  };

  // Convert float (minutes) → HH:MM:SS
  const convertFloatToTime = (value) => {
    const floatNum = parseFloat(value);
    if (isNaN(floatNum)) return "00:00:00";

    const totalSeconds = Math.round(floatNum * 60);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSave = async () => {
    const converted = convertFloatToTime(rawMinutes);

    try {
      await axios.post(API_URL, { hourly_interval: converted });
      setHourlyInterval(converted);
      alert("Interval saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update interval");
    }
  };

  return (
    <div className="flex justify-center text-xs bg-gray-100 mt-3">
      <div className="card card-primary w-full lg:w-1/3">
        <div className="card-header">
          <h3 className="card-title text-white">Hourly Ad Settings</h3>
        </div>

        <form className="p-4">
          {/* FLOAT INPUT */}
          <div className="relative mb-4">
            <input
              type="text"
              value={rawMinutes}
              onChange={(e) => setRawMinutes(e.target.value)}
              placeholder="Enter minutes (e.g., 10.5)"
              className="w-full px-2 py-2 border rounded text-xs"
              required
            />

            <label className="absolute left-3 -top-2 bg-white px-1 text-gray-500 text-[10px]">
              Interval (Minutes)
            </label>
          </div>

          {/* PREVIEW Converted Time */}
          <p className="text-gray-600 text-[10px] mb-2">
            Converted Time: <strong>{convertFloatToTime(rawMinutes)}</strong>
          </p>

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded text-xs hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default HourlyAdSettings;
