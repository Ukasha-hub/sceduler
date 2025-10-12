import React, {  } from "react";
function Header({ onToggleSidebar}) {
  return (
    <div>
    
  <nav className="main-header navbar navbar-expand navbar-white navbar-light text-rundown ">
  {/* Left navbar links */}
  <ul className="navbar-nav">
    <li className="nav-item ">
      <a className="nav-link" data-widget="pushmenu" href="#" role="button"><button onClick={onToggleSidebar}><i className="fas fa-bars" /></button></a>
    </li>
  
  </ul>
  {/* Right navbar links */}
  <ul className="navbar-nav ml-auto">
    {/* Navbar Search */}
    <li className="nav-item">
      <a className="nav-link" data-widget="navbar-search" href="#" role="button">
        <i className="fas fa-search" />
      </a>
      <div className="navbar-search-block">
        <form className="form-inline">
          <div className="input-group input-group-sm">
            <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
            <div className="input-group-append">
              <button className="btn btn-navbar" type="submit">
                <i className="fas fa-search" />
              </button>
              <button className="btn btn-navbar" type="button" data-widget="navbar-search">
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </li>
    {/* Messages Dropdown Menu */}
    <li className="nav-item dropdown">
     
      <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        <a href="#" className="dropdown-item">
          {/* Message Start */}
         
          {/* Message End */}
        </a>
        <div className="dropdown-divider" />
        <a href="#" className="dropdown-item">
          {/* Message Start */}
          
          {/* Message End */}
        </a>
        
          {/* Message End */}
       
        <div className="dropdown-divider" />
       
      </div>
    </li>
    {/* Notifications Dropdown Menu */}
    <li className="nav-item dropdown">
      <a className="nav-link" data-toggle="dropdown" href="#">
      <img
              src="dist/img/user2-160x160.jpg"
              className="img-circle elevation-2 w-100 h-100"
              alt="User Image"
            />
       
      </a>
      <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
        <span className="dropdown-item dropdown-header">Mr. User</span>
        <div className="dropdown-divider" />
        <a href="#" className="dropdown-item">
          <i className="fas fa-user mr-2" /> Profile
         
        </a>
        <div className="dropdown-divider" />
        <a href="#" className="dropdown-item">
          <i className="fas fa-power-off mr-2" /> LogOut
          
        </a>
        <div className="dropdown-divider" />
      
      </div>
    </li>
    <li className="nav-item">
      <a className="nav-link" data-widget="fullscreen" href="#" role="button">
        <i className="fas fa-expand-arrows-alt" />
      </a>
    </li>
    {/* <li className="nav-item">
      <a className="nav-link" data-widget="control-sidebar" data-controlsidebar-slide="true" href="#" role="button">
        <i className="fas fa-th-large" />
      </a>
    </li> */}
  </ul>
</nav>
{/* /.navbar */}

    </div>
  );
}
 
export default Header;