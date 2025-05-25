import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = process.env.REACT_APP_API_URL || 'https://betflix-backend.vercel.app';

// API Functions
const fetchPendingDeposits = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Authentication required. Please log in as admin.');
  const response = await fetch(`${API_URL}/api/admin/deposits`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch deposits: ${response.status}`);
  }
  return response.json();
};

const completeDeposit = async ({ paymentId }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Authentication required. Please log in as admin.');
  const response = await fetch(`${API_URL}/api/transactions/webhook`, {
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

  // Fetch pending deposits
  const { data: deposits = [], isLoading, error } = useQuery({
    queryKey: ['pendingDeposits'],
    queryFn: fetchPendingDeposits,
    onError: (err) => {
      setNotification({ type: 'error', message: err.message });
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
      {error && <p className="error" role="alert">{error.message}</p>}
      <div className="table-container">
        <div className="filter-container">
          <label htmlFor="deposit-filter">Filter:</label>
          <select
            id="deposit-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
            {filteredDeposits.length === 0 && !isLoading && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No {filter} deposit requests found.
                </td>
              </tr>
            )}
            {filteredDeposits.map((deposit) => (
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
                      disabled={mutation.isLoading}
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
    </div>
  );
}

export default Deposits;
