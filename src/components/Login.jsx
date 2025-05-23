import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../styles/login.css';
import { adminLogin } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await adminLogin(formData.email, formData.password);
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminProfile', JSON.stringify({
        id: response.admin.id,
        email: response.admin.email,
      }));
      setFormData({ email: '', password: '' });
      navigate('/dashboard');
    } catch (err) {
      console.error('Admin login failed:', err);
      const errorMessage = err.error || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page container">
      <h1 className="login-header">Admin Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
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
            aria-required="true"
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
              aria-required="true"
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
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button
          type="submit"
          className="login-button"
          disabled={isLoading}
          aria-label={isLoading ? 'Logging in' : 'Login'}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          Don't have an account? <a href="/sign-up">Sign Up</a>
        </p>
      </form>
      <div className="footer"></div>
    </div>
  );
}

export default Login;
