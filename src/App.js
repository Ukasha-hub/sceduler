import React from 'react';
import './index.css'
import './App.css';

import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import { SearchProvider } from './context/dam/SearchContext';
import { HourlyAdProvider } from './context/scheduler/HourlyAdProvider';

function App() {
  return (
    <SearchProvider>
      <HourlyAdProvider>  
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </HourlyAdProvider>
    </SearchProvider>
  );
}

export default App;
