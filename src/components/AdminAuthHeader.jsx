import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

function AdminAuthHeader() {

  return (
    <header className="header">
      <div className="logo">BetFlix</div>
      <a className="logout-btn">
        Back to Main Site
      </a>
    </header>
  );
}

export default AdminAuthHeader;
