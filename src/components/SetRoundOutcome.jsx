import React, { useState } from 'react';
import axios from 'axios';

function SetRoundOutcome({ selectedPeriod, rounds, onClose, onSetOutcome }) {
  const [formData, setFormData] = useState({
    period: selectedPeriod || '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [stakeBreakdown, setStakeBreakdown] = useState(null);
  const [result, setResult] = useState(null);

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
    if (!formData.period) {
      setError('Please select a round');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://your-api-endpoint/api/rounds/${formData.period}/set-lowest-stake-outcome`
      );
      const { result, stakeBreakdown } = response.data;

      setStakeBreakdown(stakeBreakdown);
      setResult(result);
      setShowBreakdown(true);
      setError('');

      // Notify parent component of the new outcome
      onSetOutcome(formData.period, result, stakeBreakdown);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set outcome');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowBreakdown(false);
    setStakeBreakdown(null);
    setResult(null);
    onClose();
  };

  return (
    <div className="set-outcome-modal">
      <h2 className="set-outcome-header">Set Round Outcome</h2>
      <form onSubmit={handleSubmit} className="set-outcome-form">
        <div className="form-group">
          <label htmlFor="period">Select Round</label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            disabled={isLoading || !!selectedPeriod}
            required
            aria-required="true"
            className="form-select"
          >
            <option value="">Choose a round</option>
            {rounds
              .filter((round) => !round.result)
              .map((round) => (
                <option key={round.period} value={round.period}>
                  {round.period} (Expires: {new Date(round.expiresAt).toLocaleString()})
                </option>
              ))}
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="modal-actions">
          <button
            type="submit"
            className="set-outcome-button"
            disabled={isLoading}
            aria-label={isLoading ? 'Setting outcome' : 'Set Outcome'}
          >
            {isLoading ? 'Setting Outcome...' : 'Set Outcome'}
          </button>
          <button
            className="action-btn close-btn"
            onClick={closeModal}
            disabled={isLoading}
            aria-label="Close modal"
          >
            Cancel
          </button>
        </div>
      </form>

      {showBreakdown && stakeBreakdown && (
        <div className="stake-breakdown-section">
          <h3>Stake Breakdown for {formData.period}</h3>
          <ul className="stake-breakdown">
            {Object.entries(stakeBreakdown).map(([outcome, stake]) => (
              <li key={outcome}>
                {outcome}: ${stake.toFixed(2)}
              </li>
            ))}
          </ul>
          <p>
            Selected Outcome: {result?.resultNumber} ({result?.resultColor})
          </p>
        </div>
      )}
    </div>
  );
}

export default SetRoundOutcome;