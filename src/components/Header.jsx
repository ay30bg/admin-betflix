// import React from 'react';

// const Header = () => {
// // const navigate = useNavigate()

// const handleLogout = () => {
//    const confirmLogout = window.confirm("Are you sure you want to logout?");
//     if (confirmLogout) {
//         // Perform logout operations (e.g., clear session, redirect)
//         alert("Logging out...");
//         window.location.href = '/login';
//         // Example: window.location.href = '/logout';
//     } else {
//         // User cancelled logout
//         alert("Logout cancelled.");
//     }
// }

//   return (
//     <header className="header">
//       <div className="logo">BetFlix</div>
//       <button 
//       className="logout-btn"
//       onClick={handleLogout}
//       >Logout</button>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

function Header() {
  // const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">BetFlix</div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Header;