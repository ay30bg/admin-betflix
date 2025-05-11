import React from 'react';
import { useNavigate } from 'react-router-dom';
import RoundList from './RoundList';

const Rounds = () => {
  const navigate = useNavigate();

  const handleSelectRound = (period) => {
    alert(`Manually setting results for ${period}`); // Replace with modal/form
  };

  return (
    <div className="main-content">
      <h2>Rounds</h2>
      <button
        className="action-btn"
        onClick={() => navigate('/dashboard/set-round-outcome')}
        style={{ marginBottom: '20px' }}
      >
        Set Round Outcome
      </button>
      <RoundList onSelectRound={handleSelectRound} />
    </div>
  );
};

export default Rounds;
