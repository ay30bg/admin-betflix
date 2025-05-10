import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Rounds from './components/Rounds';
import Users from './components/Users';
import Transactions from './components/Transactions';
import MainContent from './components/MainContent';
import ActivityLogs from './ActivityLogs';
import SetRoundOutcome from './components/SetRoundOutcome';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login route without Dashboard/sidebar */}
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          
          {/* Dashboard route with nested routes */}
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<MainContent />} />
            <Route path="rounds" element={<Rounds />} />
            <Route path="users" element={<Users />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="activity" element={<ActivityLogs />} />
            <Route path="set-round-outcome" element={<SetRoundOutcome />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
