// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { getAllUsers, editUser, toggleBanUser } from '../services/api';

// function Users() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [error, setError] = useState('');

//   // Fetch users
//   const { data: users, isLoading } = useQuery({
//     queryKey: ['users'],
//     queryFn: getAllUsers,
//     onError: (err) => {
//       const errorMessage = err.error || 'Failed to fetch users';
//       setError(errorMessage);
//       if (errorMessage.includes('Session expired')) {
//         setTimeout(() => {
//           localStorage.removeItem('adminToken');
//           navigate('/login');
//         }, 3000);
//       } else {
//         setTimeout(() => setError(''), 5000);
//       }
//     },
//   });

//   // Edit user mutation
//   const editMutation = useMutation({
//     mutationFn: ({ userId, data }) => editUser(userId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['users']);
//       setError('');
//     },
//     onError: (err) => {
//       const errorMessage = err.error || 'Failed to edit user';
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//     },
//   });

//   // Ban/Unban user mutation
//   const banMutation = useMutation({
//     mutationFn: ({ userId, status }) => toggleBanUser(userId, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['users']);
//       setError('');
//     },
//     onError: (err) => {
//       const errorMessage = err.error || 'Failed to update user status';
//       setError(errorMessage);
//       setTimeout(() => setError(''), 5000);
//     },
//   });

//   const handleAction = (id, action) => {
//     setError('');
//     if (action === 'edit') {
//       // Temporary prompt-based editing (replace with a form in production)
//       const username = prompt('Enter new username:', '');
//       const email = prompt('Enter new email:', '');
//       const balance = prompt('Enter new balance:', '');

//       // Frontend validation
//       if (username && username.length < 3) {
//         setError('Username must be at least 3 characters');
//         return;
//       }
//       if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         setError('Invalid email');
//         return;
//       }
//       if (balance && (isNaN(balance) || parseFloat(balance) < 0)) {
//         setError('Balance must be a positive number');
//         return;
//       }

//       if (username || email || balance) {
//         editMutation.mutate({
//           userId: id,
//           data: {
//             username: username || undefined,
//             email: email || undefined,
//             balance: balance ? parseFloat(balance) : undefined,
//           },
//         });
//       }
//     } else if (action === 'ban' || action === 'unban') {
//       banMutation.mutate({
//         userId: id,
//         status: action === 'ban' ? 'banned' : 'active',
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="main-content">
//         <h2>Users</h2>
//         <div className="loading-spinner" aria-live="polite">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="main-content">
//       <h2>Users</h2>
//       <div className="table-container">
//         {error && <p className="error-message">{error}</p>}
//         <table aria-dotenv-legacy aria-label="Users Table">
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
//             {users && users.length > 0 ? (
//               users.map((user) => (
//                 <tr key={user._id}>
//                   <td>{user._id}</td>
//                   <td>{user.username}</td>
//                   <td>{user.email}</td>
//                   <td>${user.balance.toFixed(2)}</td>
//                   <td className={`status-${user.status || 'active'}`}>
//                     {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
//                   </td>
//                   <td>
//                     <button
//                       className="action-btn edit-btn"
//                       onClick={() => handleAction(user._id, 'edit')}
//                       aria-label={`Edit user ${user.username}`}
//                       disabled={editMutation.isLoading || banMutation.isLoading}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className={`action-btn ${(user.status || 'active') === 'active' ? 'ban-btn' : 'unban-btn'}`}
//                       onClick={() => handleAction(user._id, (user.status || 'active') === 'active' ? 'ban' : 'unban')}
//                       aria-label={`${(user.status || 'active') === 'active' ? 'Ban' : 'Unban'} user ${user.username}`}
//                       disabled={editMutation.isLoading || banMutation.isLoading}
//                     >
//                       {(user.status || 'active') === 'active' ? 'Ban' : 'Unban'}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6">No users found.</td>
//               </tr>
//             )}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of users per page

  // Fetch users with search term
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: () => getAllUsers({ search: searchTerm }),
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
      const username = prompt('Enter new username:', '');
      const email = prompt('Enter new email:', '');
      const balance = prompt('Enter new balance:', '');

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

  // Pagination calculations
  const totalItems = users?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
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
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            aria-label="Search users"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="table-container">
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
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
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
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Users;
