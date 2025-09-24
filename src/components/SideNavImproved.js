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
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                <Link to={ROUTES.HOME} className="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">AdminLTE 3</span>
                </Link>
                
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar user panel (optional) */}
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div className="info">
                            <a href="#" className="d-block">Alexander Pierce</a>
                        </div>
                    </div>
                    
                    {/* SidebarSearch Form */}
                    <div className="form-inline">
                        <div className="input-group" data-widget="sidebar-search">
                            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <button className="btn btn-sidebar">
                                    <i className="fas fa-search fa-fw" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* Dashboard Section */}
                            <li className="nav-item menu-open">
                                <a href="#" className="nav-link active">
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>
                                        Dashboard
                                        <i className="right fas fa-angle-left" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link to={ROUTES.HOME} className={`nav-link ${isActive(ROUTES.HOME)}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Dashboard v1</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={ROUTES.HOME2} className={`nav-link ${isActive(ROUTES.HOME2)}`}>
                                            <i className="far fa-circle nav-icon" />
                                            <p>Dashboard v2</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <a href="./index3.html" className="nav-link">
                                            <i className="far fa-circle nav-icon" />
                                            <p>Dashboard v3 (Legacy)</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            
                            {/* Add more menu items following React Router pattern */}
                            <li className="nav-item">
                                <a href="pages/widgets.html" className="nav-link">
                                    <i className="nav-icon fas fa-th" />
                                    <p>
                                        Widgets
                                        <span className="right badge badge-danger">New</span>
                                    </p>
                                </a>
                            </li>
                            
                            {/* Rest of your existing menu items... */}
                            {/* I'm keeping the original structure but you should convert other items to React Router Links as needed */}
                            
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    );
}

export default SideNav;
