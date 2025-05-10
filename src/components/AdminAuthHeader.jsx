import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

function AdminAuthHeader() {
  // const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">BetFlix</div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default AdminAuthHeader;
