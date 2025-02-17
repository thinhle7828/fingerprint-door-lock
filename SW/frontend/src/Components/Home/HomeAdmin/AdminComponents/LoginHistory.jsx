import React from 'react';
import './AdminDashboard.css'

const LoginHistory = () => {
  // Example login history data (replace with real data from Firebase)
  const loginHistory = [
    {
      id: 1,
      date: '2024-10-01 08:30',
      username: 'john_doe',
      status: 'Success',
      imageUrl: 'https://via.placeholder.com/50', // Placeholder image
    },
    {
      id: 2,
      date: '2024-10-01 09:00',
      username: 'admin_user',
      status: 'Failure',
      imageUrl: 'https://via.placeholder.com/50',
    },
    // Add more entries...
  ];

  return (
    <div className="login-history">
      <h2>Login History</h2>
      <table className="login-history-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>User</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loginHistory.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.date}</td>
              <td>{entry.username}</td>
              <td>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginHistory;
