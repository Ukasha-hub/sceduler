import React, { useEffect, useState } from 'react';
import Header from './Header';
import SideNav from './SideNav';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {

  const location = useLocation();    // ✅ detect current route

  const noLayoutRoutes = ["/", "/login"];  
  // Add more pages in this array if you want to hide the layout on them

  

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.body.classList.remove('sidebar-collapse'); // Force open
    }
  }, []);

  const openTab = (key, title, component) => {
    setTabs(prev => {
      if (!prev.find(tab => tab.key === key)) {
        return [...prev, { key, title, component }];
      }
      return prev;
    });
    setActiveTab(key);
    if (location.pathname.startsWith("/DAM") && key !== "dam") {
      navigate("/"); // or navigate to the base route you want
    }
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
            setTabs(prev => prev.filter(t => t.key !== tab.key));
            if (activeTab === tab.key) setActiveTab(null);
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
          ? tabs.find(tab => tab.key === activeTab)?.component
          : children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
