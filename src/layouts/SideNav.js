import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";
import Tables from "../components/Tables";
import Rundown from "../pages/Rundown";
import { SettingsScheduler } from "../pages/SettingsScheduler";
import { SlugSetup } from "../pages/SlugSetup";

function SideNav({ onOpenTab }) {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (path) => (location.pathname === path ? "active" : "");

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
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {/* Scheduler */}
            <li className="nav-item">
              <button
                className="nav-link text-left w-100"
                onClick={() => onOpenTab("dashboard", "Scheduler", <Tables />)}
              >
                <i className="nav-icon fas fa-tachometer-alt text-white" />
                <p className="text-white">Scheduler</p>
              </button>
            </li>

            {/* Rundown */}
            <li className="nav-item">
              <button
                className="nav-link text-left w-100"
                onClick={() => onOpenTab("rundown", "Rundown", <Rundown />)}
              >
                <i className="nav-icon fas fa-chart-pie text-white" />
                <p className="text-white">Rundown</p>
              </button>
            </li>

            {/* Settings (Dropdown) */}
            <li className={`nav-item ${settingsOpen ? "menu-open" : ""}`}>
              <button
                className="nav-link text-left w-100"
                onClick={() => setSettingsOpen(settingsOpen)}
              >
                <i className="nav-icon fas fa-cogs text-white" />
                <p className="text-white ">
                  Settings
                  <i
                    className={`right fas fa-angle-${
                      settingsOpen ? "left" : "left"
                    }`}
                  />
                </p>
              </button>

              <ul
                className="nav nav-treeview"
                style={{
                  display: settingsOpen ? "block" : "none",
                  paddingLeft: "1.2rem",
                }}
              >
                <li className="nav-item">
                  <button
                    className="nav-link text-left w-100"
                    onClick={() =>
                      onOpenTab(
                        "settingsscheduler",
                        "Settings Scheduler",
                        <SettingsScheduler />
                      )
                    }
                  >
                    <i className="far fa-circle nav-icon text-white" />
                    <p className="text-white">Scheduler Settings</p>
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-link text-left w-100"
                    onClick={() =>
                      onOpenTab("generalsettings", "Slug Setup", <SlugSetup></SlugSetup>)
                    }
                  >
                    <i className="far fa-circle nav-icon text-white" />
                    <p className="text-white">Slug Setup</p>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default SideNav;
