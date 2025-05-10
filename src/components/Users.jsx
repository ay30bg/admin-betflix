import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Mock user data
    const mockUsers = [
      { id: 1, username: 'user1', email: 'user1@example.com', balance: 100, status: 'active' },
      { id: 2, username: 'user2', email: 'user2@example.com', balance: 0, status: 'banned' },
    ];
    setUsers(mockUsers);
  }, []);

  const handleAction = (id, action) => {
    console.log(`Action: ${action} for user ID: ${id}`);
    setError('');
  };

  return (
    <div className="main-content">
      <h2>Users</h2>
      <div className="table-container">
        {error && <p className="error-message">{error}</p>}
        <table aria-label="Users Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>${user.balance.toFixed(2)}</td>
                <td className={`status-${user.status}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </td>
                <td>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleAction(user.id, 'edit')}
                    aria-label={`Edit user ${user.username}`}
                  >
                    Edit
                  </button>
                  <button
                    className={`action-btn ${user.status === 'active' ? 'ban-btn' : 'unban-btn'}`}
                    onClick={() => handleAction(user.id, user.status === 'active' ? 'ban' : 'unban')}
                    aria-label={`${user.status === 'active' ? 'Ban' : 'Unban'} user ${user.username}`}
                  >
                    {user.status === 'active' ? 'Ban' : 'Unban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;