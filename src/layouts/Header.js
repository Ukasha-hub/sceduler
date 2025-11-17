import React, {  } from "react";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { SearchContext } from "../context/dam/SearchContext";
import API from "../API";
function Header({ onToggleSidebar}) {
  const { query, handleQueryChange, handleSearchResults } = useContext(SearchContext);

  const typingTimer = useRef(null);



  const performSearch = async (searchText) => {
    try {
      // Fetch all videos from API
      const res = await API.get("/api/v1/videos");
      const videos = res.data.videos || [];
  
      // Filter videos by file_name matching the search text (case-insensitive)
      const filtered = videos.filter(video =>
        video.file_name.toLowerCase().includes(searchText.toLowerCase())
      );
  
      // Update search results
      handleSearchResults(filtered);
      console.log("Filtered results:", filtered);
    } catch (err) {
      console.error("Search failed:", err);
      handleSearchResults([]); // Reset on error
    }
  };
  
  const handleKeyUp = (e) => {
    handleQueryChange(e.target.value); 
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      performSearch(query);
    }, 400);
  };
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
              <form className="form-inline" >
                <div className="input-group input-group-sm">
                <input
          className="form-control form-control-navbar"
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyUp={handleKeyUp}
        />
                  <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit" >
                      <i className="fas fa-search" />
                    </button>
                    <button
                      className="btn btn-navbar"
                      type="button"
                      data-widget="navbar-search"
                     
                    >
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