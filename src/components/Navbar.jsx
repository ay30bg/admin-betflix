import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

function Navbar({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('mockToken');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const navLinks = [
    { name: 'Dashboard', view: 'rounds' },
    { name: 'Users', view: 'users' },
    { name: 'Transactions', view: 'transactions' },
    { name: 'Analytics', view: 'analytics' },
  ];

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>
      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <a href="/" className="sidebar-brand">
            Betting Admin
          </a>
        </div>
        <ul className="sidebar-nav">
          {navLinks.map((link) => (
            <li key={link.view}>
              <button
                onClick={() => {
                  navigate('/', { state: { view: link.view } });
                  if (window.innerWidth <= 768) toggleSidebar();
                }}
                className={`nav-link ${location.state?.view === link.view ? 'active' : ''}`}
                aria-label={`Navigate to ${link.name}`}
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
          <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;