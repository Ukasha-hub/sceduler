// src/components/Tabs.jsx
import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="nav navbar navbar-expand navbar-white navbar-light border-bottom p-0">
      <ul className="navbar-nav overflow-hidden" role="tablist">
        <li className={`nav-item ${activeTab === "folder-content" ? "active" : ""}`}>
          <a
            className={`nav-link ${activeTab === "folder-content" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("folder-content");
            }}
          >
            Folder Content
          </a>
        </li>

        <li className={`nav-item ${activeTab === "videos" ? "active" : ""}`}>
          <a
            className={`nav-link ${activeTab === "videos" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("videos");
            }}
          >
            Videos
          </a>
        </li>

        <li className={`nav-item ${activeTab === "category" ? "active" : ""}`}>
          <a
            className={`nav-link ${activeTab === "category" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("category");
            }}
          >
            Category
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
