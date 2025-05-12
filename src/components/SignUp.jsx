import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../styles/signup.css';
import { adminSignup } from '../services/api';

function Signup() {
  const navigate = useNavigate();

  // Initialize form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });

  // State for errors, loading, notification, and password visibility
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors(''); // Clear errors on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setIsLoading(true);

    // Basic validation
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors('A valid email is required');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setErrors('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (!formData.adminKey.trim()) {
      setErrors('Admin key is required');
      setIsLoading(false);
      return;
    }

    try {
      // Call backend API for admin signup
      const response = await adminSignup(formData.email, formData.password, formData.adminKey);

      // Store token and admin data
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminProfile', JSON.stringify({
        id: response.admin.id,
        email: response.admin.email,
      }));

      setNotification({ type: 'success', message: 'Signup successful! Redirecting to login...' });
      setFormData({ email: '', password: '', confirmPassword: '', adminKey: '' });

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Admin signup failed:', error);
      const errorMessage = error.error || 'Signup failed. Please try again.';
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
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled={isLoading}
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
        {errors && <p className="signup-error">{errors}</p>}
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
