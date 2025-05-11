// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ResultForm from './ResultForm'; // Import ResultForm

// function RoundList() {
//   const [rounds, setRounds] = useState([]);
//   const [error, setError] = useState('');
//   const [isManualModalOpen, setIsManualModalOpen] = useState(false); // State for manual set modal
//   const [manualRoundPeriod, setManualRoundPeriod] = useState(null); // Selected round for manual set

//   useEffect(() => {
//     // Mock data for rounds (replace with API call)
//     const now = Date.now();
//     const roundDuration = 60 * 1000; // 1 minute
//     const mockRounds = [
//       {
//         period: `round-${Math.floor(now / roundDuration) * roundDuration}`,
//         expiresAt: new Date(now).toISOString(),
//         result: null,
//       },
//       {
//         period: `round-${Math.floor((now - roundDuration) / roundDuration) * roundDuration}`,
//         expiresAt: new Date(now - roundDuration).toISOString(),
//         result: { resultNumber: 5, resultColor: 'Green' },
//       },
//       {
//         period: `round-${Math.floor((now - 2 * roundDuration) / roundDuration) * roundDuration}`,
//         expiresAt: new Date(now - 2 * roundDuration).toISOString(),
//         result: { resultNumber: 8, resultColor: 'Red' },
//       },
//     ];
//     setRounds(mockRounds);
//   }, []);

//   const handleSetLowestStakeOutcome = async (period) => {
//     try {
//       const response = await axios.post(`https://your-api-endpoint/api/rounds/${period}/set-lowest-stake-outcome`);
//       const { result } = response.data;

//       // Update round result
//       setRounds((prev) =>
//         prev.map((round) =>
//           round.period === period ? { ...round, result } : round
//         )
//       );
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to set outcome');
//     }
//   };

//   const openManualSetModal = (period) => {
//     setManualRoundPeriod(period);
//     setIsManualModalOpen(true);
//   };

//   const closeManualSetModal = () => {
//     setIsManualModalOpen(false);
//     setManualRoundPeriod(null);
//   };

//   const handleSetResult = (period, result) => {
//     // Update rounds with the new result
//     setRounds((prev) =>
//       prev.map((round) =>
//         round.period === period ? { ...round, result } : round
//       )
//     );
//     closeManualSetModal();
//   };

//   return (
//     <div className="table-container">
//       {error && <p className="error-message">{error}</p>}
//       <table aria-label="Rounds Table">
//         <thead>
//           <tr>
//             <th>Period</th>
//             <th>Expires At</th>
//             <th>Result</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rounds.map((round) => (
//             <tr key={round.period}>
//               <td>{round.period}</td>
//               <td>{new Date(round.expiresAt).toLocaleString()}</td>
//               <td>
//                 {round.result
//                   ? `${round.result.resultNumber} (${round.result.resultColor})`
//                   : 'Not Set'}
//               </td>
//               <td>
//                 <button
//                   onClick={() => handleSetLowestStakeOutcome(round.period)}
//                   disabled={round.result !== null}
//                   aria-label={`Set lowest stake outcome for ${round.period}`}
//                   className="action-btn auto-outcome-btn"
//                 >
//                   Auto Outcome
//                 </button>
//                 <button
//                   onClick={() => openManualSetModal(round.period)}
//                   disabled={round.result !== null}
//                   aria-label={`Set results manually for ${round.period}`}
//                   className="action-btn manual-btn"
//                 >
//                   Manual Set
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {isManualModalOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <ResultForm
//               period={manualRoundPeriod}
//               onClose={closeManualSetModal}
//               onSetResult={handleSetResult}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default RoundList;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentRound, fetchBetResult, setManualRoundOutcome } from '../services/api';
import ResultForm from './ResultForm';

function RoundList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualRoundPeriod, setManualRoundPeriod] = useState(null);

  const { data: currentRound, isLoading: isCurrentLoading } = useQuery({
    queryKey: ['currentRound'],
    queryFn: fetchCurrentRound,
    onError: (err) => {
      const errorMessage = err.error || 'Failed to fetch current round';
      console.error('fetchCurrentRound error:', err);
      setError(errorMessage);
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid token')) {
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          navigate('/');
        }, 3000);
      } else {
        setTimeout(() => setError(''), 5000);
      }
    },
  });

  const { data: recentRounds, isLoading: isRecentLoading } = useQuery({
    queryKey: ['recentRounds'],
    queryFn: async () => {
      const now = Date.now();
      const roundDuration = 60 * 1000;
      const periods = [
        `round-${Math.floor((now - roundDuration) / roundDuration) * roundDuration}`,
        `round-${Math.floor((now - 2 * roundDuration) / roundDuration) * roundDuration}`,
      ];
      const results = await Promise.all(
        periods.map(async (period) => {
          try {
            const result = await fetchBetResult(period);
            return {
              period,
              expiresAt: new Date(parseInt(period.split('-')[1]) + roundDuration).toISOString(),
              resultNumber: result.bet?.resultNumber,
              resultColor: result.bet?.resultColor,
            };
          } catch (err) {
            console.warn('fetchBetResult failed for period:', period, err);
            return null;
          }
        })
      );
      return results.filter((result) => result);
    },
    onError: (err) => {
      const errorMessage = err.error || 'Failed to fetch recent rounds';
      console.error('recentRounds error:', err);
      setError(errorMessage);
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid token')) {
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          navigate('/');
        }, 3000);
      } else {
        setTimeout(() => setError(''), 5000);
      }
    },
  });

  const setManualOutcomeMutation = useMutation({
    mutationFn: ({ period, result }) => setManualRoundOutcome(period, result),
    onSuccess: (result, { period }) => {
      console.log('setManualOutcome success:', { period, result });
      queryClient.setQueryData(['recentRounds'], (old) =>
        old ? old.map((r) => (r.period === period ? { ...r, resultNumber: result.resultNumber, resultColor: result.resultColor } : r)) : old
      );
      queryClient.setQueryData(['currentRound'], (old) =>
        old && old.period === period ? { ...old, result: { resultNumber: result.resultNumber, resultColor: result.resultColor } } : old
      );
      setError('');
      closeManualSetModal();
    },
    onError: (err) => {
      const errorMessage = err.error || err.message || 'Failed to set outcome';
      console.error('setManualOutcome error:', err);
      setError(errorMessage);
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid token')) {
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          navigate('/');
        }, 3000);
      } else {
        setTimeout(() => setError(''), 5000);
      }
    },
  });

  const openManualSetModal = (period) => {
    console.log('Opening modal for period:', period);
    setManualRoundPeriod(period);
    setIsManualModalOpen(true);
  };

  const closeManualSetModal = () => {
    console.log('Closing modal');
    setIsManualModalOpen(false);
    setManualRoundPeriod(null);
  };

  const handleSetResult = (period, result) => {
    console.log('handleSetResult called:', { period, result });
    setManualOutcomeMutation.mutate({ period, result });
  };

  const rounds = currentRound
    ? [
        {
          period: currentRound.period,
          expiresAt: currentRound.expiresAt,
          resultNumber: currentRound.result?.resultNumber,
          resultColor: currentRound.result?.resultColor,
        },
        ...(recentRounds || []),
      ]
    : recentRounds || [];

  if (isCurrentLoading || isRecentLoading) {
    return <div className="loading-spinner" aria-live="polite">Loading...</div>;
  }

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
          {rounds.length > 0 ? (
            rounds.map((round) => (
              <tr key={round.period}>
                <td>{round.period}</td>
                <td>{new Date(round.expiresAt).toLocaleString()}</td>
                <td>
                  {round.resultNumber !== undefined && round.resultColor
                    ? `${round.resultNumber} (${round.resultColor})`
                    : 'Not Set'}
                </td>
                <td>
                  <button
                    onClick={() => openManualSetModal(round.period)}
                    disabled={round.resultNumber !== undefined || round.resultColor}
                    aria-label={`Set result for ${round.period}`}
                    className="action-btn manual-btn"
                  >
                    Set Result
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No rounds found.</td>
            </tr>
          )}
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
