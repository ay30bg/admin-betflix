// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { FiHome, FiUsers, FiDollarSign, FiBarChart2, FiLayers } from 'react-icons/fi';

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-header">
//         <h3>BetFlix Admin</h3>
//       </div>
//       <ul className="sidebar-menu">
//         <li>
//           <NavLink
//             to="/dashboard"
//             className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
//             end
//           >
//             <FiHome className="sidebar-icon" />
//             <span>Dashboard</span>
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/rounds"
//             className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
//           >
//             <FiLayers className="sidebar-icon" />
//             <span>Rounds</span>
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/users"
//             className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
//           >
//             <FiUsers className="sidebar-icon" />
//             <span>Users</span>
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/transactions"
//             className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
//           >
//             <FiDollarSign className="sidebar-icon" />
//             <span>Transactions</span>
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/activity"
//             className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
//           >
//             <FiBarChart2 className="sidebar-icon" />
//             <span>Activity Logs</span>
//           </NavLink>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiDollarSign, FiBarChart2, FiLayers } from 'react-icons/fi';

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
            to="/dashboard/transactions" // Updated path
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <FiDollarSign className="sidebar-icon" />
            <span>Transactions</span>
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
      </ul>
    </div>
  );
};

export default Sidebar;