// src/components/RedEnvelopeGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RedEnvelopeGenerator = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    amount: '',
    recipients: '',
  });
  const [link, setLink] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLink(null);
    setLoading(true);

    try {
      // Get JWT token from localStorage (or your auth method)
      const token = localStorage.getItem('token');

      // Make API call to create red envelope
      const response = await axios.post(
        '/api/red-envelope/create', // Adjust to your backend URL
        {
          amount: parseFloat(formData.amount),
          recipients: parseInt(formData.recipients, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authenticateToken middleware
          },
        }
      );

      // Set the generated link
      setLink(response.data.link);
    } catch (err) {
      // Handle errors
      setError(err.response?.data?.message || 'Failed to generate red envelope link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="red-envelope-generator">
      <h2>Generate Red Envelope Link</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Total Amount ($):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            placeholder="Enter total amount"
          />
        </div>
        <div className="form-group">
          <label htmlFor="recipients">Number of Recipients:</label>
          <input
            type="number"
            id="recipients"
            name="recipients"
            value={formData.recipients}
            onChange={handleChange}
            min="1"
            required
            placeholder="Enter number of recipients"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Link'}
        </button>
      </form>

      {link && (
        <div className="success-message">
          <h3>Red Envelope Link Generated:</h3>
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default RedEnvelopeGenerator;
