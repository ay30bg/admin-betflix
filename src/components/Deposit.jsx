// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// // API Functions
// const fetchPendingDeposits = async () => {
//   const token = localStorage.getItem('adminToken');
//   if (!token) throw new Error('Authentication required. Please log in as admin.');

//   // Try primary endpoint for deposits
//   let response = await fetch(`${API_URL}/api/admin/deposits`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   // Fallback to transactions endpoint with deposit filter if /deposits fails
//   if (!response.ok && response.status === 404) {
//     console.warn('Deposits endpoint not found, falling back to transactions endpoint');
//     response = await fetch(`${API_URL}/api/admin/transactions?type=crypto-deposit&status=pending`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//   }

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//     throw new Error(errorData.error || `Failed to fetch deposits: ${response.status}`);
//   }

//   const data = await response.json();
//   // Ensure username is included (assuming backend populates userId with User document)
//   return data.map((tx) => ({
//     ...tx,
//     username: tx.userId?.username || 'Unknown', // Adjust based on actual User schema
//   }));
// };

// const completeDeposit = async ({ paymentId }) => {
//   const token = localStorage.getItem('adminToken');
//   if (!token) throw new Error('Authentication required. Please log in as admin.');
//   const response = await fetch(`${API_URL}/api/admin/transactions/webhook`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ paymentId, status: 'completed' }),
//   });
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//     throw new Error(errorData.error || `Failed to complete deposit: ${response.status}`);
//   }
//   return response.json();
// };

// function Deposits() {
//   const queryClient = useQueryClient();
//   const [filter, setFilter] = useState('pending');
//   const [notification, setNotification] = useState(null);

//   // Fetch pending deposits
//   const { data: deposits = [], isLoading, error } = useQuery({
//     queryKey: ['pendingDeposits', filter],
//     queryFn: fetchPendingDeposits,
//     onError: (err) => {
//       setNotification({
//         type: 'error',
//         message: err.message || 'Failed to load deposits. Please check the API endpoint or contact support.',
//       });
//     },
//     retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
//   });

//   // Mutation for completing deposits
//   const mutation = useMutation({
//     mutationFn: completeDeposit,
//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries(['pendingDeposits']);
//       setNotification({
//         type: 'success',
//         message: `Deposit completed successfully!`,
//       });
//     },
//     onError: (err) => {
//       setNotification({
//         type: 'error',
//         message: err.message || `Failed to complete deposit`,
//       });
//     },
//   });

//   // Handle complete action
//   const handleComplete = (paymentId) => {
//     mutation.mutate({ paymentId });
//   };

//   // Filter deposits
//   const filteredDeposits = filter === 'all' ? deposits : deposits.filter((t) => t.status === filter);

//   // Clear notifications after 3 seconds
//   useEffect(() => {
//     if (notification) {
//       const timeout = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timeout);
//     }
//   }, [notification]);

//   return (
//     <div className="main-content">
//       <h2>Deposit Requests</h2>
//       {notification && (
//         <div className={`result ${notification.type}`} role="alert" aria-live="polite">
//           {notification.message}
//         </div>
//       )}
//       {isLoading && <div className="loading-spinner" aria-live="polite">Loading...</div>}
//       {error && (
//         <p className="error" role="alert">
//           {error.message}.{' '}
//           <a href="/login" onClick={() => localStorage.removeItem('adminToken')}>
//             Log in again
//           </a>{' '}
//           or check the API configuration.
//         </p>
//       )}
//       <div className="table-container">
//         <div className="filter-container">
//           <label htmlFor="deposit-filter">Filter:</label>
//           <select
//             id="deposit-filter"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="filter-select"
//             disabled={isLoading || mutation.isLoading}
//           >
//             <option value="pending">Pending</option>
//             <option value="all">All</option>
//             <option value="completed">Completed</option>
//             <option value="failed">Failed</option>
//           </select>
//         </div>
//         <table aria-label="Deposit Requests Table">
//           <thead>
//             <tr>
//               <th>Username</th>
//               <th>Amount</th>
//               <th>Currency</th>
//               <th>Network</th>
//               <th>Payment ID</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredDeposits.length === 0 && !isLoading && (
//               <tr>
//                 <td colSpan="7" style={{ textAlign: 'center' }}>
//                   No {filter} deposit requests found.
//                 </td>
//               </tr>
//             )}
//             {filteredDeposits.map((deposit) => (
//               <tr key={deposit._id}>
//                 <td>{deposit.username}</td>
//                 <td>${deposit.amount.toFixed(2)}</td>
//                 <td>{deposit.cryptoCurrency}</td>
//                 <td>{deposit.network || 'N/A'}</td>
//                 <td>{deposit.paymentId || 'N/A'}</td>
//                 <td className={`status-${deposit.status}`}>
//                   {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
//                 </td>
//                 <td>
//                   {deposit.status === 'pending' && (
//                     <button
//                       className="action-btn complete-btn"
//                       onClick={() => handleComplete(deposit.paymentId)}
//                       aria-label={`Complete deposit for ${deposit.username}`}
//                       disabled={mutation.isLoading || !deposit.paymentId}
//                     >
//                       Complete
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Deposits;

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// API Functions (unchanged)
const fetchPendingDeposits = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Authentication required. Please log in as admin.');

  let response = await fetch(`${API_URL}/api/admin/deposits`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok && response.status === 404) {
    console.warn('Deposits endpoint not found, falling back to transactions endpoint');
    response = await fetch(`${API_URL}/api/admin/transactions?type=crypto-deposit&status=pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch deposits: ${response.status}`);
  }

  const data = await response.json();
  return data.map((tx) => ({
    ...tx,
    username: tx.userId?.username || 'Unknown',
  }));
};

const completeDeposit = async ({ paymentId }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Authentication required. Please log in as admin.');
  const response = await fetch(`${API_URL}/api/admin/transactions/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paymentId, status: 'completed' }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to complete deposit: ${response.status}`);
  }
  return response.json();
};

function Deposits() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending');
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 10; // Number of deposits per page

  // Fetch pending deposits
  const { data: deposits = [], isLoading, error } = useQuery({
    queryKey: ['pendingDeposits', filter],
    queryFn: fetchPendingDeposits,
    onError: (err) => {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to load deposits. Please check the API endpoint or contact support.',
      });
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Mutation for completing deposits
  const mutation = useMutation({
    mutationFn: completeDeposit,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['pendingDeposits']);
      setNotification({
        type: 'success',
        message: `Deposit completed successfully!`,
      });
      setCurrentPage(1); // Reset to first page after completing a deposit
    },
    onError: (err) => {
      setNotification({
        type: 'error',
        message: err.message || `Failed to complete deposit`,
      });
    },
  });

  // Handle complete action
  const handleComplete = (paymentId) => {
    mutation.mutate({ paymentId });
  };

  // Filter deposits
  const filteredDeposits = filter === 'all' ? deposits : deposits.filter((t) => t.status === filter);

  // Pagination calculations
  const totalItems = filteredDeposits.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeposits = filteredDeposits.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      <h2>Deposit Requests</h2>
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
          <label htmlFor="deposit-filter">Filter:</label>
          <select
            id="deposit-filter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
            className="filter-select"
            disabled={isLoading || mutation.isLoading}
          >
            <option value="pending">Pending</option>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <table aria-label="Deposit Requests Table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Network</th>
              <th>Payment ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDeposits.length === 0 && !isLoading && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No {filter} deposit requests found.
                </td>
              </tr>
            )}
            {paginatedDeposits.map((deposit) => (
              <tr key={deposit._id}>
                <td>{deposit.username}</td>
                <td>${deposit.amount.toFixed(2)}</td>
                <td>{deposit.cryptoCurrency}</td>
                <td>{deposit.network || 'N/A'}</td>
                <td>{deposit.paymentId || 'N/A'}</td>
                <td className={`status-${deposit.status}`}>
                  {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                </td>
                <td>
                  {deposit.status === 'pending' && (
                    <button
                      className="action-btn complete-btn"
                      onClick={() => handleComplete(deposit.paymentId)}
                      aria-label={`Complete deposit for ${deposit.username}`}
                      disabled={mutation.isLoading || !deposit.paymentId}
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
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

export default Deposits;
