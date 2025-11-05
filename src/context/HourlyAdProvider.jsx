// HourlyAdContext.jsx
import React, { createContext, useState } from "react";

export const HourlyAdContext = createContext();

export const HourlyAdProvider = ({ children }) => {
  const [hourlyInterval, setHourlyInterval] = useState(60); // default 1 hour in minutes

  return (
    <HourlyAdContext.Provider value={{ hourlyInterval, setHourlyInterval }}>
      {children}
    </HourlyAdContext.Provider>
  );
};
