// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );


import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MainContent() {
  const [filter, setFilter] = useState('7d');
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeRounds: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchAnalyticsData = async () => {
      try {
        // Fetch total users from the backend
        const usersResponse = await fetch('http://betflix-backend.vercel.app/api/analytics/total-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Uncomment and add JWT token if authentication is required
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch total users');
        }

        const usersData = await usersResponse.json();

        // Mock other metrics (replace with real API calls when available)
        const updatedMetrics = {
          totalUsers: usersData.totalUsers || 0,
          totalRevenue: 12345.67, // Replace with API call
          activeRounds: 56, // Replace with API call
        };

        // Mock chart data (replace with API call when available)
        const mockChartData = {
          '7d': {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [
              {
                label: 'User Registrations',
                data: [100, 120, 150, 130, 170, 200, 220],
                borderColor: '#e53e3e', // BetFlix red
                backgroundColor: 'rgba(229, 62, 62, 0.2)',
                tension: 0.4,
              },
            ],
          },
          '30d': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
              {
                label: 'User Registrations',
                data: [400, 450, 500, 550],
                borderColor: '#e53e3e',
                backgroundColor: 'rgba(229, 62, 62, 0.2)',
                tension: 0.4,
              },
            ],
          },
          '90d': {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            datasets: [
              {
                label: 'User Registrations',
                data: [1000, 1100, 1234],
                borderColor: '#e53e3e',
                backgroundColor: 'rgba(229, 62, 62, 0.2)',
                tension: 0.4,
              },
            ],
          },
        };

        setMetrics(updatedMetrics);
        setChartData(mockChartData[filter] || { labels: [], datasets: [] });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Unable to load analytics data. Please try again later.');
        setMetrics({ totalUsers: 0, totalRevenue: 0, activeRounds: 0 });
        setChartData({ labels: [], datasets: [] });
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [filter]);

  if (loading) {
    return (
      <div className="main-content">
        <h2>Analytics</h2>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <h2>Analytics</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2>Analytics</h2>
      <div className="analytics-container">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{metrics.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>${metrics.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Active Rounds</h3>
            <p>{metrics.activeRounds}</p>
          </div>
        </div>

        {/* Chart with Filter */}
        <div className="chart-container">
          <div className="filter-container">
            <label htmlFor="analytics-filter">Time Range:</label>
            <select
              id="analytics-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          {chartData.labels.length > 0 ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'User Registrations Over Time' },
                },
              }}
            />
          ) : (
            <p className="no-data">No data available for this time range.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainContent;
// function MainContent() {
//   const [filter, setFilter] = useState('7d');
//   const [metrics, setMetrics] = useState({});
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [],
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     // Mock analytics data
//     const mockMetrics = {
//       totalUsers: 1234,
//       totalRevenue: 12345.67,
//       activeRounds: 56,
//     };

//     const mockChartData = {
//       '7d': {
//         labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
//         datasets: [
//           {
//             label: 'User Registrations',
//             data: [100, 120, 150, 130, 170, 200, 220],
//             borderColor: '#e53e3e', // BetFlix red
//             backgroundColor: 'rgba(229, 62, 62, 0.2)',
//             tension: 0.4,
//           },
//         ],
//       },
//       '30d': {
//         labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//         datasets: [
//           {
//             label: 'User Registrations',
//             data: [400, 450, 500, 550],
//             borderColor: '#e53e3e',
//             backgroundColor: 'rgba(229, 62, 62, 0.2)',
//             tension: 0.4,
//           },
//         ],
//       },
//       '90d': {
//         labels: ['Month 1', 'Month 2', 'Month 3'],
//         datasets: [
//           {
//             label: 'User Registrations',
//             data: [1000, 1100, 1234],
//             borderColor: '#e53e3e',
//             backgroundColor: 'rgba(229, 62, 62, 0.2)',
//             tension: 0.4,
//           },
//         ],
//       },
//     };

//     // Simulate API delay
//     setTimeout(() => {
//       setMetrics(mockMetrics);
//       setChartData(mockChartData[filter] || { labels: [], datasets: [] });
//       setLoading(false);
//     }, 500);
//   }, [filter]);

//   if (loading) {
//     return (
//       <div className="main-content">
//         <h2>Analytics</h2>
//         <div className="loading">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="main-content">
//       <h2>Analytics</h2>
//       <div className="analytics-container">
//         {/* Stats Cards */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <h3>Total Users</h3>
//             <p>{metrics.totalUsers || 0}</p>
//           </div>
//           <div className="stat-card">
//             <h3>Total Revenue</h3>
//             <p>${(metrics.totalRevenue || 0).toFixed(2)}</p>
//           </div>
//           <div className="stat-card">
//             <h3>Active Rounds</h3>
//             <p>{metrics.activeRounds || 0}</p>
//           </div>
//         </div>

//         {/* Chart with Filter */}
//         <div className="chart-container">
//           <div className="filter-container">
//             <label htmlFor="analytics-filter">Time Range:</label>
//             <select
//               id="analytics-filter"
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="filter-select"
//             >
//               <option value="7d">Last 7 Days</option>
//               <option value="30d">Last 30 Days</option>
//               <option value="90d">Last 90 Days</option>
//             </select>
//           </div>
//           {chartData.labels.length > 0 ? (
//             <Line
//               data={chartData}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { position: 'top' },
//                   title: { display: true, text: 'User Registrations Over Time' },
//                 },
//               }}
//             />
//           ) : (
//             <p className="no-data">No data available for this time range.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MainContent;
