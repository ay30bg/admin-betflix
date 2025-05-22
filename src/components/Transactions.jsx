// import React, { useState, useEffect } from 'react';

// function Transactions() {
//   const [transactions, setTransactions] = useState([]);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     // Mock transaction data
//     const mockTransactions = [
//       { id: 1, user: 'user1', amount: 50, currency: 'BTC', status: 'pending' },
//       { id: 2, user: 'user2', amount: 100, currency: 'USDT', status: 'completed' },
//     ];
//     setTransactions(mockTransactions);
//   }, []);

//   const handleAction = (id, action) => {
//     console.log(`Action: ${action} for transaction ID: ${id}`);
//   };

//   const filteredTransactions = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);

//   return (
//     <div className="main-content">
//       <h2>Transactions</h2>
//       <div className="table-container">
//         <div className="filter-container">
//           <label htmlFor="transaction-filter">Filter:</label>
//           <select
//             id="transaction-filter"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="all">All</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//           </select>
//         </div>
//         <table aria-label="Transactions Table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>User</th>
//               <th>Amount</th>
//               <th>Currency</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTransactions.map((tx) => (
//               <tr key={tx.id}>
//                 <td>{tx.id}</td>
//                 <td>{tx.user}</td>
//                 <td>{tx.amount}</td>
//                 <td>{tx.currency}</td>
//                 <td className={`status-${tx.status}`}>
//                   {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
//                 </td>
//                 <td>
//                   {tx.status === 'pending' && (
//                     <>
//                       <button
//                         className="action-btn approve-btn"
//                         onClick={() => handleAction(tx.id, 'approve')}
//                         aria-label={`Approve transaction ${tx.id}`}
//                       >
//                         Approve
//                       </button>
//                       <button
//                         className="action-btn reject-btn"
//                         onClick={() => handleAction(tx.id, 'reject')}
//                         aria-label={`Reject transaction ${tx.id}`}
//                       >
//                         Reject
//                       </button>
//                     </>
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

// export default Transactions;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// API Functions
const fetchPendingWithdrawalRequests = async () => {
  const token = localStorage.getItem('adminToken'); // Assuming admin authentication
  if (!token) throw new Error('Authentication required. Please log in as admin.');
  const response = await fetch(`${API_URL}/api/admin/withdrawal-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch withdrawal requests: ${response.status}`);
  }
  return response.json();
};

const updateWithdrawalRequest = async ({ requestId, action }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Authentication required. Please log in as admin.');
  const response = await fetch(`${API_URL}/api/admin/update-withdrawal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId, action }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to ${action} withdrawal request: ${response.status}`);
  }
  return response.json();
};

function Transactions() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('pending'); // Default to pending for admin dashboard
  const [notification, setNotification] = useState(null);

  // Fetch pending withdrawal requests
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['pendingWithdrawals'],
    queryFn: fetchPendingWithdrawalRequests,
    onError: (err) => {
      setNotification({ type: 'error', message: err.message });
    },
    retry: (failureCount, error) => failureCount < 2 && !error.message.includes('Authentication'),
  });

  // Mutation for approving/rejecting withdrawals
  const mutation = useMutation({
    mutationFn: updateWithdrawalRequest,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['pendingWithdrawals']);
      setNotification({
        type: 'success',
        message: `Withdrawal request ${variables.action}d successfully!`,
      });
    },
    onError: (err, variables) => {
      setNotification({
        type: 'error',
        message: err.message || `Failed to ${variables.action} withdrawal request`,
      });
    },
  });

  // Handle approve/reject actions
  const handleAction = (requestId, action) => {
    mutation.mutate({ requestId, action });
  };

  // Filter transactions (though primarily showing pending for admin)
  const filteredTransactions = filter === 'all' ? transactions : transactions.filter((t) => t.status === filter);

  // Clear notifications after 3 seconds
  useEffect(() => {
    if (notification) {
      const timeout = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [notification]);

  return (
    <div className="main-content">
      <h2>Withdrawal Requests</h2>
      {notification && (
        <div className={`result ${notification.type}`} role="alert" aria-live="polite">
          {notification.message}
        </div>
      )}
      {isLoading && <div className="loading-spinner" aria-live="polite">Loading...</div>}
      {error && <p className="error" role="alert">{error.message}</p>}
      <div className="table-container">
        <div className="filter-container">
          <label htmlFor="transaction-filter">Filter:</label>
          <select
            id="transaction-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
            disabled={isLoading || mutation.isLoading}
          >
            <option value="pending">Pending</option>
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <table aria-label="Withdrawal Requests Table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Amount</th>
              <th>Wallet Address</th>
              <th>Currency</th>
              <th>Network</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 && !isLoading && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No {filter} withdrawal requests found.
                </td>
              </tr>
            )}
            {filteredTransactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.username}</td>
                <td>${tx.amount.toFixed(2)}</td>
                <td>{tx.walletAddress}</td>
                <td>{tx.cryptoCurrency}</td>
                <td>{tx.network || 'N/A'}</td>
                <td className={`status-${tx.status}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </td>
                <td>
                  {tx.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleAction(tx._id, 'approve')}
                        aria-label={`Approve withdrawal request for ${tx.username}`}
                        disabled={mutation.isLoading}
                      >
                        Approve
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleAction(tx._id, 'reject')}
                        aria-label={`Reject withdrawal request for ${tx.username}`}
                        disabled={mutation.isLoading}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
