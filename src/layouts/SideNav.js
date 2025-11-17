import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

import Rundown from "../pages/Rundown";
import { SettingsScheduler } from "../pages/scheduler/SettingsScheduler";
import { SlugSetup } from "../pages/scheduler/SlugSetup";
import FilterSetup from "../pages/scheduler/FilterSetup";
import SchedulerTable from "../pages/scheduler/SchedulerTable";
import ClearSchedule from "../pages/scheduler/ClearSchedule";
import ServerSetup from "../pages/scheduler/ServerSetup";
import HourlyAdSettings from "../pages/scheduler/HourlyAdSettings";
import DAM from "../pages/dam/DAM";
import { CalendarIcon, Cog6ToothIcon, Squares2X2Icon, FilterIcon, TrashIcon, ServerIcon, ClockIcon, ListBulletIcon } from "@heroicons/react/24/outline";

function SideNav({ onOpenTab }) {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const isActive = (path) => (location.pathname === path ? "active" : "");
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [rundownOpen, setRundownOpen] = useState(false);

  return (
    <aside className="main-sidebar sidebar-dark-primary text-rundown fixed lg:static">
      {/* Brand Logo */}
      <Link to={ROUTES.HOME} className="brand-link">
        <img
          src="dist/img/sysnova.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3 w-30 h-60"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light text-rundown">Sysnova</span>
      </Link>

      {/* Sidebar */}
      <div className="sidebar">
        {/*  <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img
              src="dist/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User Image"
            />
          </div>
          <div className="info">
            <a href="#" className="d-block">
              Mr. User
            </a>
          </div>
        </div> */}
       

        {/* Search */}
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar form-control-sm"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar btn-sm">
                <i className="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar">
        <nav className="mt-2">
  <ul className="nav nav-pills nav-sidebar flex-column" role="menu">

    {/* ✅ Scheduler Section (No dropdown) */}
    {/* ✅ Scheduler Section (No dropdown) */}
<li className="nav-header text-gray-400 font-bold mt-3 mb-1" style={{ borderBottom: "1px solid #444" }}>
  Scheduler Section
</li>

<div style={{ borderLeft: "2px solid #6c757d", marginLeft: "5px" }}>

  <li className="nav-item" style={{ paddingLeft: "5px" }}>
    <button className="flex gap-2 p-2 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("dashboard", "Scheduler", <SchedulerTable />)}>
    <CalendarIcon className="w-5 h-5 text-gray-300" />
      <p>Scheduler</p>
    </button>
  </li>

  {/* Settings Label */}
  <li className="nav-item" style={{ paddingLeft: "5px", marginTop: "6px" }}>
    <p className="px-2 text-gray-400 font-bold">Settings</p>
  </li>

  {/* Child items */}
  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("settingsscheduler", "Scheduler Settings", <SettingsScheduler />)}>
    <Cog6ToothIcon className="w-5 h-5 text-gray-300" />
      <p>Scheduler Settings</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("slugSetup", "Slug Setup", <SlugSetup />)}>
    <Squares2X2Icon className="w-5 h-5 text-gray-300" />
      <p>Slug Setup</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("filterSetup", "Filter Setup", <FilterSetup />)}>
    <TrashIcon className="w-5 h-5 text-gray-300" />
      <p>Filter Setup</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("clearSchedule", "Clear Schedule", <ClearSchedule />)}>
    <TrashIcon className="w-5 h-5 text-gray-300" />
      <p>Clear Schedule</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("serverSetup", "Server Setup", <ServerSetup />)}>
    <ServerIcon className="w-5 h-5 text-gray-300" />
      <p>Server Setup</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md  text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("hourlyAdSettings", "Hourly Ad Setup", <HourlyAdSettings />)}>
    <ClockIcon className="w-5 h-5 text-gray-300" />
      <p>Hourly Ad Setup</p>
    </button>
  </li>

</div>


    {/* ✅ Rundown Section */}
    <li className="nav-header text-gray-400 font-bold mt-4 mb-1" style={{ borderBottom: "1px solid #444" }}>
      Rundown Section
    </li>

    <li className="nav-item" style={{ borderLeft: "2px solid #6c757d", marginLeft: "5px", paddingLeft:"5px" }}>
      <button className="flex gap-2 p-2 text-start w-full hover:rounded-md text-white hover:bg-gray-600  hover:text-white transition duration-200" onClick={() => onOpenTab("rundown", "Rundown", <Rundown />)}>
      <ListBulletIcon className="w-5 h-5 text-gray-300" />
        <p>Rundown</p>
      </button>
    </li>

  </ul>
</nav>


      </div>
        <ul
            className="nav nav-pills nav-sidebar flex-column"
            
          >
            {/*
            <li className="nav-item">
              <button
                className="nav-link text-left w-100"
                onClick={() =>  navigate(`/DAM`)}
              >
                <i className="nav-icon fas fa-chart-pie text-white" />
                <p className="text-white">DAMm</p>
              </button>
            </li>
             */}
             
          </ul>
      </div>
      <nav className="mt-2">
        
        </nav>
    </aside>
  );
}

export default SideNav;
