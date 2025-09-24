import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

function SideNav() {
    const location = useLocation();

    // Helper function to check if current path matches
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <div>
            {/* Main Sidebar Container */}
            <aside className="main-sidebar sidebar-dark-primary elevation-4 text-rundown">
                {/* Brand Logo */}
                <Link to={ROUTES.HOME} className="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light text-rundown">Sysnova</span>
                </Link>
                
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar user panel (optional) */}
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div className="info">
                            <a href="#" className="d-block">Mr. User</a>
                        </div>
                    </div>
                    
                    {/* SidebarSearch Form */}
                    <div className="form-inline">
                        <div className="input-group" data-widget="sidebar-search">
                            <input className="form-control form-control-sidebar form-control-sm" type="search" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <button className="btn btn-sidebar btn-sm">
                                    <i className="fas fa-search fa-fw" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                             {/* Add more menu items following React Router pattern */}
                            <li className="nav-item">
                                <Link to={ROUTES.HOME} className={`nav-link ${isActive(ROUTES.HOME)}`}>
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>Dashboard</p>
                                </Link>
                            </li>
                            {/* Add more menu items following React Router pattern */}
                            <li className="nav-item">
                                <Link to={ROUTES.RUNDOWN} className={`nav-link ${isActive(ROUTES.RUNDOWN)}`}>
                                    <i className="nav-icon fas fa-chart-pie" />
                                    <p>Rundown</p>
                                </Link>
                            </li>
                            
                            {/* Rest of your existing menu items... */}
                            {/* Dashboard Section */}
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fas fa-wrench" />
                                    <p>
                                        Settings
                                        <i className="right fas fa-angle-left" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link to={ROUTES.SETTINGS} className={`nav-link ${isActive(ROUTES.SETTINGS)}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Settings</p>
                                        </Link>
                                    </li>
                                </ul>
                            </li>



                            
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    );
}

export default SideNav;
