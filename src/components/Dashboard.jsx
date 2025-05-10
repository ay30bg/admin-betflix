import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-container">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;