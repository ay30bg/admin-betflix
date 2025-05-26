// src/components/UserReferrals.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Mock API function (replace with real API call)
const fetchUsersWithReferrals = async () => {
  // Simulating API response
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      referrals: [
        { id: 'r1', name: 'Alice Smith', email: 'alice@example.com', status: 'active' },
        { id: 'r2', name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive' },
      ],
    },
    {
      id: '2',
      name: 'Jane Roe',
      email: 'jane@example.com',
      referrals: [
        { id: 'r3', name: 'Charlie Brown', email: 'charlie@example.com', status: 'active' },
      ],
    },
    {
      id: '3',
      name: 'Sam Wilson',
      email: 'sam@example.com',
      referrals: [], // User with no referrals
    },
  ];
};

// Vanilla CSS styles
const styles = `
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .table-container {
    overflow-x: auto;
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
    background-color: #f4f4f4;
    font-weight: bold;
  }

  .toggle-button {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }

  .toggle-button:hover {
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

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
  }

  .status-active {
    background-color: #28a745;
  }

  .status-inactive {
    background-color: #dc3545;
  }

  .loading {
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
`;

const UserReferrals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Fetch users and their referrals on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsersWithReferrals();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Toggle expanded state for a user's referrals
  const toggleReferrals = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Users and Their Referrals</h1>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Referral Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.referrals.length}</td>
                  <td>
                    {user.referrals.length > 0 && (
                      <button
                        onClick={() => toggleReferrals(user.id)}
                        className="toggle-button"
                      >
                        {expandedUser === user.id ? 'Hide Referrals' : 'Show Referrals'}
                      </button>
                    )}
                  </td>
                </tr>
                {expandedUser === user.id && user.referrals.length > 0 && (
                  <tr>
                    <td colSpan={4} className="referrals-container">
                      <h3 className="referrals-title">Referrals</h3>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Referral Name</th>
                            <th>Referral Email</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.referrals.map((referral) => (
                            <tr key={referral.id}>
                              <td>{referral.name}</td>
                              <td>{referral.email}</td>
                              <td>
                                <span
                                  className={`status-badge status-${referral.status}`}
                                >
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReferrals;
