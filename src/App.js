import React from 'react';
import './index.css'
import './App.css';

import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <SearchProvider>
    <MainLayout>
      <AppRoutes />
    </MainLayout>
    </SearchProvider>
  );
}

export default App;
