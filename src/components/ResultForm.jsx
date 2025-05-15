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
    const number = Number(resultNumber);
    if (!Number.isInteger(number) || number < 0 || number > 9) {
      setError('Number must be an integer between 0 and 9');
      return;
    }
    if (!['Green', 'Red'].includes(resultColor)) {
      setError('Invalid color');
      return;
    }

    console.log('Submitting result:', { period, resultNumber: number, resultColor });
    onSetResult(period, { resultNumber: number, resultColor });
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
            aria-label="Result number"
          />
        </div>
        <div>
          <label>Result Color</label>
          <select
            value={resultColor}
            onChange={(e) => setResultColor(e.target.value)}
            required
            aria-label="Result color"
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

