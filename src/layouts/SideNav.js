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
import UserSetup from "../pages/UserSetup";
import UserAccessSetup from "../pages/UserAccessSetup";
import PackageSettings from "../pages/scheduler/PackageSettings";

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
    <button className="flex gap-2 p-2 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("dashboard", "Scheduler")}>
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
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("settingsscheduler", "Scheduler Settings")}>
    <Cog6ToothIcon className="w-5 h-5 text-gray-300" />
      <p>Scheduler Settings</p>
    </button>
  </li>
  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("settingspackage", "Package Settings")}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
</svg>

      <p>Package Settings</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("slugSetup", "Slug Setup")}>
    <Squares2X2Icon className="w-5 h-5 text-gray-300" />
      <p>Slug Setup</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("filterSetup", "Filter Setup")}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
</svg>

      <p>Filter Setup</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("clearSchedule", "Clear Schedule")}>
    <TrashIcon className="w-5 h-5 text-gray-300" />
      <p>Clear Schedule</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("serverSetup", "Server Setup")}>
    <ServerIcon className="w-5 h-5 text-gray-300" />
      <p>Server Setup</p>
    </button>
  </li>

  <li className="nav-item" style={{ paddingLeft: "10px" }}>
    <button className="flex gap-2 ml-2 mt-2 p-1 text-start w-full hover:rounded-md  text-white hover:bg-gray-600 hover:text-white transition duration-200" onClick={() => onOpenTab("hourlyAdSettings", "Hourly Ad Setup")}>
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
      <button className="flex gap-2 p-2 text-start w-full hover:rounded-md text-white hover:bg-gray-600  hover:text-white transition duration-200" onClick={() => onOpenTab("rundown", "Rundown")}>
      <ListBulletIcon className="w-5 h-5 text-gray-300" />
        <p>Rundown</p>
      </button>
    </li>

    {/* ✅ Rundown Section */}
    <li className="nav-header text-gray-400 font-bold mt-4 mb-1" style={{ borderBottom: "1px solid #444" }}>
      User Role Section
    </li>

    <li className="nav-item" style={{ borderLeft: "2px solid #6c757d", marginLeft: "5px", paddingLeft:"5px" }}>
      <button className="flex gap-2 p-2 text-start w-full hover:rounded-md text-white hover:bg-gray-600  hover:text-white transition duration-200" onClick={() => onOpenTab("usersetup", "UserSetup")}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

        <p>User Setup</p>
      </button>
      <button className="flex gap-2 p-2 text-start w-full hover:rounded-md text-white hover:bg-gray-600  hover:text-white transition duration-200" onClick={() => onOpenTab("historylog", "History Log")}>
      

        <p>History Log</p>
      </button>
    </li>
  
  {/*<li className="nav-item" style={{ borderLeft: "2px solid #6c757d", marginLeft: "5px", paddingLeft:"5px" }}>
      <button className="flex gap-2 p-2 text-start w-full hover:rounded-md text-white hover:bg-gray-600  hover:text-white transition duration-200" onClick={() => onOpenTab("useraccesssetup", "UserAccessSetup", <UserAccessSetup></UserAccessSetup>)}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
</svg>


        <p>User Access Setup</p>
      </button>
    </li> */}
    

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
