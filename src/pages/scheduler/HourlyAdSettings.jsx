import React, { useEffect, useState } from "react";
import axios from "axios";
import TimePicker from "react-time-picker"; // make sure you install this package

const API_URL = `${process.env.REACT_APP_API_URL}/api/v1/hourly-ad/`;

const HourlyAdSettings = () => {
  const [hourlyInterval, setHourlyInterval] = useState("01:00:00"); // default 1 hour

  useEffect(() => {
    fetchInterval();
  }, []);

  const fetchInterval = async () => {
    try {
      const res = await axios.get(API_URL);
      setHourlyInterval(res.data.hourly_interval || "01:00:00");
    } catch (err) {
      console.error(err);
      alert("Failed to load hourly ad settings");
    }
  };

  const handleIntervalChange = async (value) => {
    setHourlyInterval(value);

    try {
      await axios.post(API_URL, { hourly_interval: value });
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

        <form className="p-2">
          <div className="mb-4 relative">
            <TimePicker
              onChange={handleIntervalChange}
              value={hourlyInterval}
              format="HH:mm:ss"
              disableClock={true}
              clearIcon={null}
              className="w-full ml-2 mt-3 text-xs"
            />
            <label className="absolute left-2 top-2 z-10 origin-left -translate-y-3 scale-75 bg-white px-1 text-gray-500 transition-all duration-200">
              Interval (HH:mm:ss)
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HourlyAdSettings;
