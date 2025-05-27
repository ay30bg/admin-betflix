import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Rounds from './components/Rounds';
import Users from './components/Users';
import Deposits from './components/Deposit';
import Transactions from './components/Transactions';
import MainContent from './components/MainContent';
import ActivityLogs from './ActivityLogs';
import SetRoundOutcome from './components/SetRoundOutcome';
import Signup from './components/SignUp';
import ResetPassword from './components/ResetPassword';
import AdminForgotPassword from './components/AdminForgotPassword';
import Support from './components/Support';
import UserReferral from './components/UserReferral';
import RedEnvelope from './components/RedEnvelopeGenerator';
import './App.css';

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Login route without Dashboard/sidebar */}
            <Route path="/" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Dashboard route with nested routes */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<MainContent />} />
              <Route path="rounds" element={<Rounds />} />
              <Route path="users" element={<Users />} />
              <Route path="referrals" element={<UserReferral />} />
              <Route path="withdrawals" element={<Transactions />} />
              <Route path="deposits" element={<Deposits />} />
              <Route path="activity" element={<ActivityLogs />} />
              <Route path="set-round-outcome" element={<SetRoundOutcome />} />
              <Route path="redenvelope" element={<RedEnvelope />} />
              <Route path="support" element={<Support />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
