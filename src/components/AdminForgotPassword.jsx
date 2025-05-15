// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/login.css';

// function AdminForgotPassword() {
//   const navigate = useNavigate();
//   const API_URL = process.env.REACT_APP_API_URL;

//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setEmail(e.target.value);
//     setError('');
//     setSuccess('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) {
//       setError('Please enter your email');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to send reset link');
//       }

//       setSuccess('A password reset link has been sent to your email.');
//       setEmail('');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleBack = () => {
//     navigate('/login');
//   };

//   return (
//     <div className="forgot-password-page container">
//       <h1 className="forgot-password-header">Forgot Password</h1>
//       <form onSubmit={handleSubmit} className="forgot-password-form">
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             required
//             disabled={isLoading}
//           />
//         </div>
//         {error && <p className="error-message">{error}</p>}
//         {success && <p className="success-message">{success}</p>}
//         <button type="submit" className="login-button" disabled={isLoading}>
//           {isLoading ? 'Sending...' : 'Send Reset Link'}
//         </button>
//         <p>
//           Remember your password? <a href="/">Login</a>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default AdminForgotPassword;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api'; // Adjust path to your API client file
import '../styles/login.css';

function AdminForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Please enter your email');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword(email); // Use API client function
      setSuccess(response.message || 'A password reset link has been sent to your email.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/login'); // Adjust to match your login route
  };

  return (
    <div className="forgot-password-page container">
      <h1 className="forgot-password-header">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
         <p>         
           Remember your password? <a href="/">Login</a>
      </p>
      </form>
    </div>
  );
}

export default AdminForgotPassword;
