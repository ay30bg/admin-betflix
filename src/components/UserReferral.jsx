import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// API Function to fetch users with referrals
const fetchUsersWithReferrals = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Authentication required. Please log in as admin.');

  const response = await fetch(`${API_URL}/api/admin/referrals`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch referrals: ${response.status}`);
  }

  const data = await response.json();
  console.log('Raw API response:', data);

  // Ensure data is an array and map to expected format
  return Array.isArray(data) ? data.map((user) => ({
    id: user.id || user._id || 'unknown',
    username: user.username || 'Unknown',
    email: user.email || 'Unknown',
    referrals: Array.isArray(user.referrals) ? user.referrals.map((referral) => ({
      id: referral.id || referral._id || 'unknown',
      username: referral.username || 'Unknown',
      email: referral.email || 'Unknown',
      status: referral.status ? referral.status.toLowerCase() : 'active',
    })) : [],
  })) : [];
};

// Vanilla CSS styles (unchanged)
const styles = `
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .main-content h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .table-container {
    overflow-x: auto;
  }

  .filter-container {
    margin-bottom: 20px;
  }

  .filter-container label {
    margin-right: 10px;
    font-weight: bold;
  }

  .filter-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    border: 1px solid #ddd;
  }

  .table th, .table td {
    padding: 12px;
    text-align: left;
    border-top: 1px solid #ddd;
  }

  .table th {
    background-color: #3b82f6;
    font-weight: bold;
  }

  .action-btn {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }

  .action-btn:hover {
    color: #0056b3;
  }

  .referrals-container {
    padding-left: 20px;
    background-color: #f9f9f9;
  }

  .referrals-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .status-active {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    color: #fff;
    background-color: #28a745;
    font-size: 14px;
  }

  .status-inactive {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    color: #fff;
    background-color: #dc3545;
    font-size: 14px;
  }

  .loading-spinner {
    text-align: center;
    padding: 20px;
    font-size: 16px;
  }

  .error {
    text-align: center;
    padding: 20px;
    color: #dc3545;
    font-size: 16px;
  }

  .result.success {
    text-align: center;
    padding: 10px;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .result.error {
    text-align: center;
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    margin-bottom: 20px;
  }
`;

const UserReferrals = () => {
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  // Inject CSS styles into the document
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Fetch users with referrals using React Query
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['usersWithReferrals'],
    queryFn: fetchUsersWithReferrals,
    onError: (err) => {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to load referrals. Please check the API endpoint or contact support.',
      });
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Log processed data for debugging
  useEffect(() => {
    console.log('Processed users data:', users);
  }, [users]);

  // Filter referrals based on status
  const getFilteredReferrals = (referrals) => {
    console.log('Filtering referrals:', referrals, 'with filter:', filter);
    if (filter === 'all') return referrals;
    return referrals.filter((referral) => referral.status === filter);
  };

  // Toggle expanded state for a user's referrals
  const toggleReferrals = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Clear notifications after 3 seconds
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  return (
    <div className="main-content">
      <h2>Referral Management</h2>
      {notification && (
        <div className={`result ${notification.type}`} role="alert" aria-live="polite">
          {notification.message}
        </div>
      )}
      {isLoading && <div className="loading-spinner" aria-live="polite">Loading...</div>}
      {error && (
        <p className="error" role="alert">
          {error.message}.{' '}
          <a href="/login" onClick={() => localStorage.removeItem('adminToken')}>
            Log in again
          </a>{' '}
          or check the API configuration.
        </p>
      )}
      <div className="table-container">
        <div className="filter-container">
          <label htmlFor="referral-filter">Filter Referrals:</label>
          <select
            id="referral-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
            disabled={isLoading}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={refetch}
            className="action-btn"
            style={{ marginLeft: '10px' }}
            disabled={isLoading}
            aria-label="Refresh referral data"
          >
            Refresh
          </button>
        </div>
        <table className="table" aria-label="Users and Referrals Table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Referral Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !isLoading && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No users with referrals found.
                </td>
              </tr>
            )}
            {users.map((user) => {
              const filteredReferrals = getFilteredReferrals(user.referrals);
              return (
                <React.Fragment key={user.id}>
                  <tr>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{filteredReferrals.length}</td>
                    <td>
                      {user.referrals.length > 0 && (
                        <button
                          className="action-btn"
                          onClick={() => toggleReferrals(user.id)}
                          aria-label={`Toggle referrals for ${user.username}`}
                        >
                          {expandedUser === user.id ? 'Hide Referrals' : 'Show Referrals'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedUser === user.id && filteredReferrals.length > 0 && (
                    <tr>
                      <td colSpan="4" className="referrals-container">
                        <h3 className="referrals-title">Referrals</h3>
                        <table className="table" aria-label={`Referrals for ${user.username}`}>
                          <thead>
                            <tr>
                              <th>Referral Username</th>
                              <th>Referral Email</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredReferrals.map((referral) => (
                              <tr key={referral.id}>
                                <td>{referral.username}</td>
                                <td>{referral.email}</td>
                                <td>
                                  <span className={`status-${referral.status}`}>
                                    {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReferrals;
