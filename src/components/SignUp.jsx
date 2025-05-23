// src/SignUp.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../styles/signup.css';
import { adminSignup } from '../services/api';

function Signup() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });

  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setIsLoading(true);

    const trimmedData = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
      adminKey: formData.adminKey.trim(),
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedData.email)) {
      setErrors('A valid email is required');
      emailRef.current.focus();
      setIsLoading(false);
      return;
    }
    if (trimmedData.password.length < 8) {
      setErrors('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(trimmedData.password)) {
      setErrors('Password must include uppercase, lowercase, number, and special character');
      setIsLoading(false);
      return;
    }
    if (trimmedData.password !== trimmedData.confirmPassword) {
      setErrors('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (!trimmedData.adminKey) {
      setErrors('Admin key is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await adminSignup(trimmedData.email, trimmedData.password, trimmedData.adminKey);
      console.log('API Response (raw):', response);

      // Normalize response
      const data = response.data || response;
      const admin = data.admin || (data.data && data.data.admin) || {};
      const token = data.token || (data.data && data.data.token);
      const adminId = admin.id || admin._id;

      // Validate normalized response
      if (!token || !admin || !adminId || !admin.email) {
        console.error('Invalid response structure:', { data, token, admin, adminId, adminEmail: admin.email });
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminProfile', JSON.stringify({
        id: adminId,
        email: admin.email,
      }));

      setNotification({ type: 'success', message: 'Signup successful! Redirecting to login...' });
      setFormData({ email: '', password: '', confirmPassword: '', adminKey: '' });

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Admin signup failed:', error);
      const errorMessage = {
        'Email already in use': 'This email is already registered.',
        'Invalid admin key': 'The admin key is incorrect. Please check and try again.',
        'Email, password, and admin key are required': 'All fields are required.',
        'Invalid response from server': 'Unexpected server response. Please try again or contact support.',
        'Server error': 'Server error. Please try again later.',
        default: error.message || 'Signup failed. Please try again.',
      }[error.message] || error.message;
      setErrors(errorMessage);
      setNotification({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page container">
      {isLoading && (
        <div className="loading-spinner" aria-live="polite">
          Processing...
        </div>
      )}
      {notification && (
        <div className={`result ${notification.type}`} role="alert">
          {notification.message}
        </div>
      )}
      <h1 className="signup-header">Admin Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            ref={emailRef}
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
            aria-describedby={errors ? 'email-error' : undefined}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="password-input"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              className="password-input"
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="adminKey">Admin Key</label>
          <input
            type="text"
            id="adminKey"
            name="adminKey"
            value={formData.adminKey}
            onChange={handleChange}
            placeholder="Enter admin key"
            required
            disabled={isLoading}
          />
        </div>
        {errors && (
          <p id="email-error" className="signup-error" aria-live="assertive">
            {errors}
          </p>
        )}
        <button type="submit" className="signup-button" disabled={isLoading}>
          Sign Up
        </button>
        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
