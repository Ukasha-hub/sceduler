import React from 'react';
import Header from './Header';
import SideNav from './SideNav';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="wrapper">
      <Header />
      <SideNav />
      <div className="content-wrapper ">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
