import React, { useState, useEffect } from 'react';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock transaction data
    const mockTransactions = [
      { id: 1, user: 'user1', amount: 50, currency: 'BTC', status: 'pending' },
      { id: 2, user: 'user2', amount: 100, currency: 'USDT', status: 'completed' },
    ];
    setTransactions(mockTransactions);
  }, []);

  const handleAction = (id, action) => {
    console.log(`Action: ${action} for transaction ID: ${id}`);
  };

  const filteredTransactions = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);

  return (
    <div className="main-content">
      <h2>Transactions</h2>
      <div className="table-container">
        <div className="filter-container">
          <label htmlFor="transaction-filter">Filter:</label>
          <select
            id="transaction-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <table aria-label="Transactions Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.user}</td>
                <td>{tx.amount}</td>
                <td>{tx.currency}</td>
                <td className={`status-${tx.status}`}>
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </td>
                <td>
                  {tx.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleAction(tx.id, 'approve')}
                        aria-label={`Approve transaction ${tx.id}`}
                      >
                        Approve
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleAction(tx.id, 'reject')}
                        aria-label={`Reject transaction ${tx.id}`}
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