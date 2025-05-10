import React, { useState, useEffect } from 'react';

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Mock data
    setLogs([
      { id: 1, user: 'user1', action: 'Login', time: '2025-05-09 10:00' },
      { id: 2, user: 'user2', action: 'Bet Placed', time: '2025-05-09 10:05' },
    ]);
  }, []);

  return (
    <div className="main-content">
      <h2>Activity Logs</h2>
      <div className="table-container">
        <table aria-label="Activity Logs Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Action</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityLogs;