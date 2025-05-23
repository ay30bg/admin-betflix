// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';

// function Header() {
//   // const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     navigate('/');
//   };

//   return (
//     <header className="header">
//       <div className="logo">BetFlix</div>
//       <button className="logout-btn" onClick={handleLogout}>
//         Logout
//       </button>
//     </header>
//   );
// }

// export default Header;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { adminLogout } from '../services/api'; // Import logout API function

// function Header() {
//   const navigate = useNavigate();
//   const [greeting, setGreeting] = useState('');

//   // Determine greeting based on time of day
//   useEffect(() => {
//     const updateGreeting = () => {
//       const hour = new Date().getHours(); // Get current hour (0-23)
//       if (hour >= 1 && hour < 12) {
//         setGreeting('Good Morning');
//       } else if (hour >= 12 && hour < 16) {
//         setGreeting('Good Afternoon');
//       } else {
//         setGreeting('Good Evening');
//       }
//     };

//     updateGreeting(); // Set initial greeting
//     const interval = setInterval(updateGreeting, 60000); // Update every minute
//     return () => clearInterval(interval); // Cleanup interval
//   }, []);

//   // Handle logout
//   const handleLogout = async () => {
//     // try {
//     //   // Call backend logout endpoint (if implemented)
//     //   await adminLogout();
//     // } catch (err) {
//     //   console.error('Logout failed:', err);
//     // } finally {
//     //   // Clear admin token and profile
//     //   localStorage.removeItem('adminToken');
//     //   localStorage.removeItem('adminProfile');
//       navigate('/'); // Redirect to login page
//     }
//   };

//   return (
//     <header className="header">
//       <div className="greeting">{greeting}</div>
//       <button className="logout-btn" onClick={handleLogout}>
//         Logout
//       </button>
//     </header>
//   );
// }

// export default Header;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../services/api'; // Import logout API function

function Header() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  // Determine greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours(); // Get current hour (0-23)
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    updateGreeting(); // Set initial greeting
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval); // Cleanup interval
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await adminLogout(); // Call API logout function
      localStorage.removeItem('adminToken'); // Clear token
      localStorage.removeItem('adminProfile'); // Clear profile if used
      console.log('Logout successful');
      navigate('/'); // Redirect to login page
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to log out. Please try again.'); // User feedback
      // Optionally keep user on current page or retry
    }
  };

  return (
    <header className="header flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="greeting text-lg font-semibold">{greeting}</div>
      <button
        className="logout-btn px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
