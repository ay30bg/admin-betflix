import React, { useState } from 'react';
// import axios from 'axios'; // Optional, if you add API submission

function ResultForm({ period, onClose, onSetResult }) {
  const [resultNumber, setResultNumber] = useState('');
  const [resultColor, setResultColor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resultNumber || !resultColor) {
      setError('Please fill in all fields');
      return;
    }

    const result = {
      resultNumber: parseInt(resultNumber),
      resultColor,
    };

    try {
      // Optional: Replace with actual API call if needed
      // await axios.post(`https://your-api-endpoint/api/rounds/${period}/set-result`, result);

      // Notify parent component and update rounds
      onSetResult(period, result);
      setSuccess(`Results set for ${period}`);
      setResultNumber('');
      setResultColor('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set result');
    }
  };

  return (
    <div className="form-container">
      <h2>Set Results for {period}</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} aria-label="Set Round Results Form">
        <div className="form-group">
          <label htmlFor="resultNumber">Result Number (0-9)</label>
          <input
            id="resultNumber"
            type="number"
            min="0"
            max="9"
            value={resultNumber}
            onChange={(e) => setResultNumber(e.target.value)}
            required
            aria-required="true"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="resultColor">Result Color</label>
          <select
            id="resultColor"
            value={resultColor}
            onChange={(e) => setResultColor(e.target.value)}
            required
            aria-required="true"
            className="form-select"
          >
            <option value="">Select Color</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="form-button">
            Set Results
          </button>
          <button
            type="button"
            className="form-button cancel-btn"
            onClick={onClose}
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResultForm;