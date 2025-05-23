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

// function MainContent() {
//   const [filter, setFilter] = useState('7d');
//   const [metrics, setMetrics] = useState({
//     totalUsers: 0,
//     totalRevenue: 0,
//     activeRounds: 0,
//   });
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     const fetchAnalyticsData = async () => {
//       try {
//         // Fetch total users
//         const usersResponse = await fetch('https://betflix-backend.vercel.app/api/analytics/total-users', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         if (!usersResponse.ok) {
//           throw new Error('Failed to fetch total users');
//         }

//         const usersData = await usersResponse.json();

//         // Fetch registration data
//         const registrationsResponse = await fetch(
//           `https://betflix-backend.vercel.app/api/analytics/registrations/${filter}`,
//           {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );

//         if (!registrationsResponse.ok) {
//           throw new Error('Failed to fetch registration data');
//         }

//         const { registrations } = await registrationsResponse.json();

//         // Prepare chart data
//         const labels = registrations.map((item) => item.date);
//         const data = registrations.map((item) => item.count);

//         const updatedChartData = {
//           labels,
//           datasets: [
//             {
//               label: 'User Registrations',
//               data,
//               borderColor: '#e53e3e',
//               backgroundColor: 'rgba(229, 62, 62, 0.2)',
//               tension: 0.4,
//             },
//           ],
//         };

//         // Update metrics (replace other metrics with real API calls when available)
//         const updatedMetrics = {
//           totalUsers: usersData.totalUsers || 0,
//           totalRevenue: 12345.67, // Replace with API call
//           activeRounds: 56, // Replace with API call
//         };

//         setMetrics(updatedMetrics);
//         setChartData(updatedChartData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching analytics data:', err);
//         setError('Unable to load analytics data. Please try again later.');
//         setMetrics({ totalUsers: 0, totalRevenue: 0, activeRounds: 0 });
//         setChartData({ labels: [], datasets: [] });
//         setLoading(false);
//       }
//     };

//     fetchAnalyticsData();
//   }, [filter]);

//   if (loading) {
//     return (
//       <div className="main-content">
//         <h2>Analytics</h2>
//         <div className="loading">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="main-content">
//         <h2>Analytics</h2>
//         <div className="error">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="main-content">
//       <h2>Analytics</h2>
//       <div className="analytics-container">
//         <div className="stats-grid">
//           <div className="stat-card">
//             <h3>Total Users</h3>
//             <p>{metrics.totalUsers}</p>
//           </div>
//           <div className="stat-card">
//             <h3>Total Revenue</h3>
//             <p>${metrics.totalRevenue.toFixed(2)}</p>
//           </div>
//           <div className="stat-card">
//             <h3>Active Rounds</h3>
//             <p>{metrics.activeRounds}</p>
//           </div>
//         </div>

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
        // Get JWT token from localStorage (or your auth mechanism)
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch total users
        const usersResponse = await fetch('https://betflix-backend.vercel.app/api/analytics/total-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch total users');
        }

        const usersData = await usersResponse.json();

        // Fetch registration data
        const registrationsResponse = await fetch(
          `https://betflix-backend.vercel.app/api/analytics/registrations/${filter}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!registrationsResponse.ok) {
          throw new Error('Failed to fetch registration data');
        }

        const { registrations } = await registrationsResponse.json();

        // Fetch active rounds
        const activeRoundsResponse = await fetch('https://betflix-backend.vercel.app/api/admin/active-rounds', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!activeRoundsResponse.ok) {
          throw new Error('Failed to fetch active rounds');
        }

        const activeRoundsData = await activeRoundsResponse.json();

        // Fetch total revenue
        const revenueResponse = await fetch('https://betflix-backend.vercel.app/api/admin/total-revenue', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!revenueResponse.ok) {
          throw new Error('Failed to fetch total revenue');
        }

        const revenueData = await revenueResponse.json();

        // Prepare chart data
        const labels = registrations.map((item) => item.date);
        const data = registrations.map((item) => item.count);

        const updatedChartData = {
          labels,
          datasets: [
            {
              label: 'User Registrations',
              data,
              borderColor: '#e53e3e',
              backgroundColor: 'rgba(229, 62, 62, 0.2)',
              tension: 0.4,
            },
          ],
        };

        // Update metrics
        const updatedMetrics = {
          totalUsers: usersData.totalUsers || 0,
          totalRevenue: revenueData.totalRevenue || 0,
          activeRounds: activeRoundsData.activeRounds || 0,
        };

        setMetrics(updatedMetrics);
        setChartData(updatedChartData);
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
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{metrics.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>${metrics.totalRevenue}</p>
          </div>
          <div className="stat-card">
            <h3>Active Rounds</h3>
            <p>{metrics.activeRounds}</p>
          </div>
        </div>

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
