import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResultForm from './ResultForm'; // Import ResultForm

function RoundList() {
  const [rounds, setRounds] = useState([]);
  const [error, setError] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false); // State for manual set modal
  const [manualRoundPeriod, setManualRoundPeriod] = useState(null); // Selected round for manual set

  useEffect(() => {
    // Mock data for rounds (replace with API call)
    const now = Date.now();
    const roundDuration = 60 * 1000; // 1 minute
    const mockRounds = [
      {
        period: `round-${Math.floor(now / roundDuration) * roundDuration}`,
        expiresAt: new Date(now).toISOString(),
        result: null,
      },
      {
        period: `round-${Math.floor((now - roundDuration) / roundDuration) * roundDuration}`,
        expiresAt: new Date(now - roundDuration).toISOString(),
        result: { resultNumber: 5, resultColor: 'Green' },
      },
      {
        period: `round-${Math.floor((now - 2 * roundDuration) / roundDuration) * roundDuration}`,
        expiresAt: new Date(now - 2 * roundDuration).toISOString(),
        result: { resultNumber: 8, resultColor: 'Red' },
      },
    ];
    setRounds(mockRounds);
  }, []);

  const handleSetLowestStakeOutcome = async (period) => {
    try {
      const response = await axios.post(`https://your-api-endpoint/api/rounds/${period}/set-lowest-stake-outcome`);
      const { result } = response.data;

      // Update round result
      setRounds((prev) =>
        prev.map((round) =>
          round.period === period ? { ...round, result } : round
        )
      );
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set outcome');
    }
  };

  const openManualSetModal = (period) => {
    setManualRoundPeriod(period);
    setIsManualModalOpen(true);
  };

  const closeManualSetModal = () => {
    setIsManualModalOpen(false);
    setManualRoundPeriod(null);
  };

  const handleSetResult = (period, result) => {
    // Update rounds with the new result
    setRounds((prev) =>
      prev.map((round) =>
        round.period === period ? { ...round, result } : round
      )
    );
    closeManualSetModal();
  };

  return (
    <div className="table-container">
      {error && <p className="error-message">{error}</p>}
      <table aria-label="Rounds Table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Expires At</th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((round) => (
            <tr key={round.period}>
              <td>{round.period}</td>
              <td>{new Date(round.expiresAt).toLocaleString()}</td>
              <td>
                {round.result
                  ? `${round.result.resultNumber} (${round.result.resultColor})`
                  : 'Not Set'}
              </td>
              <td>
                <button
                  onClick={() => handleSetLowestStakeOutcome(round.period)}
                  disabled={round.result !== null}
                  aria-label={`Set lowest stake outcome for ${round.period}`}
                  className="action-btn auto-outcome-btn"
                >
                  Auto Outcome
                </button>
                <button
                  onClick={() => openManualSetModal(round.period)}
                  disabled={round.result !== null}
                  aria-label={`Set results manually for ${round.period}`}
                  className="action-btn manual-btn"
                >
                  Manual Set
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isManualModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <ResultForm
              period={manualRoundPeriod}
              onClose={closeManualSetModal}
              onSetResult={handleSetResult}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RoundList;