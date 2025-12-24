import React, { useEffect, useState } from 'react';
import Header from './Header';
import SideNav from './SideNav';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';

import Rundown from "../pages/Rundown";
import { SettingsScheduler } from "../pages/scheduler/SettingsScheduler";
import { SlugSetup } from "../pages/scheduler/SlugSetup";
import FilterSetup from "../pages/scheduler/FilterSetup";
import SchedulerTable from "../pages/scheduler/SchedulerTable";
import ClearSchedule from "../pages/scheduler/ClearSchedule";
import ServerSetup from "../pages/scheduler/ServerSetup";
import HourlyAdSettings from "../pages/scheduler/HourlyAdSettings";
import DAM from "../pages/dam/DAM";

import UserSetup from "../pages/UserSetup";
import UserAccessSetup from "../pages/UserAccessSetup";
import PackageSettings from "../pages/scheduler/PackageSettings";
import HistoryLog from '../pages/scheduler/HistoryLog';

const COMPONENT_MAP = {
  dashboard: <SchedulerTable />,
  settingsscheduler: <SettingsScheduler />,
  settingspackage: <PackageSettings />,
  slugSetup: <SlugSetup />,
  filterSetup: <FilterSetup />,
  clearSchedule: <ClearSchedule />,
  serverSetup: <ServerSetup />,
  hourlyAdSettings: <HourlyAdSettings />,
  rundown: <Rundown />,
  usersetup: <UserSetup />,
  useraccesssetup: <UserAccessSetup />,
  dam: <DAM />,
  historylog: <HistoryLog></HistoryLog>
};

const MainLayout = ({ children }) => {

  const location = useLocation();    // ✅ detect current route

  const noLayoutRoutes = ["/", "/login"];  
  // Add more pages in this array if you want to hide the layout on them

  

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTabs = JSON.parse(localStorage.getItem("app_tabs")) || [];
    const savedActiveTab = localStorage.getItem("app_active_tab");
  
    if (savedTabs.length > 0) {
      setTabs(savedTabs);
    }
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("app_tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("app_active_tab", activeTab);
    }
  }, [activeTab]);
 
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.body.classList.remove('sidebar-collapse'); // Force open
    }
  }, []);

  const openTab = (key, title) => {
    setTabs(prev => {
      if (!prev.find(tab => tab.key === key)) {
        const updated = [...prev, { key, title }];
        localStorage.setItem("app_tabs", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  
    setActiveTab(key);
    localStorage.setItem("app_active_tab", key);
  };
  
  

  // If current route SHOULD NOT show layout, just return children directly
  if (noLayoutRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="wrapper ">
      <Header />
      <SideNav onOpenTab={openTab} />
      <div className=" content-wrapper lg:ml-[500px]">
      {tabs.length > 0 && (
  <div className="flex flex-wrap border-b border-gray-300 bg-gray-100 p-2">
    {tabs.map(tab => (
      <div
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`px-1 py-1 text-xs cursor-pointer mr-1 rounded-t-lg 
          ${activeTab === tab.key 
            ? 'bg-blue-600 text-white shadow-sm ' 
            : 'bg-gray-300 text-gray-800 hover:bg-gray-400 '}`}
      >
        <span>{tab.title}</span>
        <span
  onClick={(e) => {
    e.stopPropagation();

    const tabIndex = tabs.findIndex(t => t.key === tab.key);
    const updated = tabs.filter(t => t.key !== tab.key);
    setTabs(updated);
    localStorage.setItem("app_tabs", JSON.stringify(updated));

    // If the closed tab was the active one → activate next available tab
    if (activeTab === tab.key) {
      let nextActive = null;

      // Prefer tab to the right
      if (updated[tabIndex]) {
        nextActive = updated[tabIndex].key;
      }
      // If no right tab, choose last tab
      else if (updated.length > 0) {
        nextActive = updated[updated.length - 1].key;
      }

      setActiveTab(nextActive);
      if (nextActive) {
        localStorage.setItem("app_active_tab", nextActive);
      } else {
        localStorage.removeItem("app_active_tab");
      }
    }
  }}
  className="ml-2 text-xs hover:text-red-400"
>
  ×
</span>

      </div>
    ))}
  </div>
)}

        {/* ✅ Render Active Tab Content or Normal Route */}
        {activeTab
  ? COMPONENT_MAP[activeTab]
  : children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
