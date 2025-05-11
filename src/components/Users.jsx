// import React, { useState, useEffect } from 'react';

// function Users() {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Mock user data
//     const mockUsers = [
//       { id: 1, username: 'user1', email: 'user1@example.com', balance: 100, status: 'active' },
//       { id: 2, username: 'user2', email: 'user2@example.com', balance: 0, status: 'banned' },
//     ];
//     setUsers(mockUsers);
//   }, []);

//   const handleAction = (id, action) => {
//     console.log(`Action: ${action} for user ID: ${id}`);
//     setError('');
//   };

//   return (
//     <div className="main-content">
//       <h2>Users</h2>
//       <div className="table-container">
//         {error && <p className="error-message">{error}</p>}
//         <table aria-label="Users Table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Username</th>
//               <th>Email</th>
//               <th>Balance</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.username}</td>
//                 <td>{user.email}</td>
//                 <td>${user.balance.toFixed(2)}</td>
//                 <td className={`status-${user.status}`}>
//                   {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                 </td>
//                 <td>
//                   <button
//                     className="action-btn edit-btn"
//                     onClick={() => handleAction(user.id, 'edit')}
//                     aria-label={`Edit user ${user.username}`}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className={`action-btn ${user.status === 'active' ? 'ban-btn' : 'unban-btn'}`}
//                     onClick={() => handleAction(user.id, user.status === 'active' ? 'ban' : 'unban')}
//                     aria-label={`${user.status === 'active' ? 'Ban' : 'Unban'} user ${user.username}`}
//                   >
//                     {user.status === 'active' ? 'Ban' : 'Unban'}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Users;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, editUser, toggleBanUser } from '../services/api';

function Users() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    onError: (err) => {
      const errorMessage = err.error || 'Failed to fetch users';
      setError(errorMessage);
      if (errorMessage.includes('Session expired')) {
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          navigate('/login');
        }, 3000);
      } else {
        setTimeout(() => setError(''), 5000);
      }
    },
  });

  // Edit user mutation
  const editMutation = useMutation({
    mutationFn: ({ userId, data }) => editUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setError('');
    },
    onError: (err) => {
      const errorMessage = err.error || 'Failed to edit user';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    },
  });

  // Ban/Unban user mutation
  const banMutation = useMutation({
    mutationFn: ({ userId, status }) => toggleBanUser(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setError('');
    },
    onError: (err) => {
      const errorMessage = err.error || 'Failed to update user status';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    },
  });

  const handleAction = (id, action) => {
    setError('');
    if (action === 'edit') {
      // Temporary prompt-based editing (replace with a form in production)
      const username = prompt('Enter new username:', '');
      const email = prompt('Enter new email:', '');
      const balance = prompt('Enter new balance:', '');

      // Frontend validation
      if (username && username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Invalid email');
        return;
      }
      if (balance && (isNaN(balance) || parseFloat(balance) < 0)) {
        setError('Balance must be a positive number');
        return;
      }

      if (username || email || balance) {
        editMutation.mutate({
          userId: id,
          data: {
            username: username || undefined,
            email: email || undefined,
            balance: balance ? parseFloat(balance) : undefined,
          },
        });
      }
    } else if (action === 'ban' || action === 'unban') {
      banMutation.mutate({
        userId: id,
        status: action === 'ban' ? 'banned' : 'active',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <h2>Users</h2>
        <div className="loading-spinner" aria-live="polite">Loading...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2>Users</h2>
      <div className="table-container">
        {error && <p className="error-message">{error}</p>}
        <table aria-dotenv-legacy aria-label="Users Table">
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
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>${user.balance.toFixed(2)}</td>
                  <td className={`status-${user.status || 'active'}`}>
                    {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                  </td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleAction(user._id, 'edit')}
                      aria-label={`Edit user ${user.username}`}
                      disabled={editMutation.isLoading || banMutation.isLoading}
                    >
                      Edit
                    </button>
                    <button
                      className={`action-btn ${(user.status || 'active') === 'active' ? 'ban-btn' : 'unban-btn'}`}
                      onClick={() => handleAction(user._id, (user.status || 'active') === 'active' ? 'ban' : 'unban')}
                      aria-label={`${(user.status || 'active') === 'active' ? 'Ban' : 'Unban'} user ${user.username}`}
                      disabled={editMutation.isLoading || banMutation.isLoading}
                    >
                      {(user.status || 'active') === 'active' ? 'Ban' : 'Unban'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
