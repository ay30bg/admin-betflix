import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiDollarSign, FiBarChart2, FiLayers, FiCreditCard, FiPhone, FiActivity, FiEnvelope  } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>BetFlix Admin</h3>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            end
          >
            <FiHome className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/rounds" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiLayers className="sidebar-icon" />
            <span>Rounds</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/users" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiUsers className="sidebar-icon" />
            <span>Users</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/deposits" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiCreditCard className="sidebar-icon" />
            <span>Deposits</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/withdrawals" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiDollarSign className="sidebar-icon" />
            <span>Withdrawals</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/activity" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiBarChart2 className="sidebar-icon" />
            <span>Activity Logs</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/referrals" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiActivity className="sidebar-icon" />
            <span>Referrals</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/redenvelope" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiEnvelope className="sidebar-icon" />
            <span>Red Envelope</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/support" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiPhone  className="sidebar-icon" />
            <span>Support</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
