import React, { useState } from 'react';

function ResultForm({ period, onClose, onSetResult }) {
  const [resultNumber, setResultNumber] = useState('');
  const [resultColor, setResultColor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resultNumber || !resultColor) {
      setError('Please provide both number and color');
      return;
    }
    if (!Number.isInteger(Number(resultNumber)) || Number(resultNumber) < 0 || Number(resultNumber) > 9) {
      setError('Number must be between 0 and 9');
      return;
    }
    if (!['Green', 'Red'].includes(resultColor)) {
      setError('Invalid color');
      return;
    }

    onSetResult(period, { resultNumber: Number(resultNumber), resultColor });
  };

  return (
    <div className="result-form">
      <h3>Set Result for {period}</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Result Number (0-9)</label>
          <input
            type="number"
            min="0"
            max="9"
            value={resultNumber}
            onChange={(e) => setResultNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Result Color</label>
          <select
            value={resultColor}
            onChange={(e) => setResultColor(e.target.value)}
            required
          >
            <option value="">Select Color</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
          </select>
        </div>
        <button type="submit">Set Result</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default ResultForm;
