import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import AdminAuthHeader from './AdminAuthHeader'
import '../styles/login.css'



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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    // Mock login: Accept any non-empty credentials
    setTimeout(() => {
      localStorage.setItem('mockToken', 'mock-admin-token');
      setFormData({ email: '', password: '' });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  return (
    <div className="login-page container">
      <AdminAuthHeader />
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
          <div className="password-wrapper">
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
     
    </div>
  );
}

export default Login;
