// import React, { useState } from 'react';

// function ResultForm({ period, onClose, onSetResult }) {
//   const [resultNumber, setResultNumber] = useState('');
//   const [resultColor, setResultColor] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!resultNumber || !resultColor) {
//       setError('Please provide both number and color');
//       return;
//     }
//     const number = Number(resultNumber);
//     if (!Number.isInteger(number) || number < 0 || number > 9) {
//       setError('Number must be an integer between 0 and 9');
//       return;
//     }
//     if (!['Green', 'Red'].includes(resultColor)) {
//       setError('Invalid color');
//       return;
//     }

//     console.log('Submitting result:', { period, resultNumber: number, resultColor });
//     onSetResult(period, { resultNumber: number, resultColor });
//   };

//   return (
//     <div className="result-form">
//       <h3>Set Result for {period}</h3>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Result Number (0-9)</label>
//           <input
//             type="number"
//             min="0"
//             max="9"
//             value={resultNumber}
//             onChange={(e) => setResultNumber(e.target.value)}
//             required
//             aria-label="Result number"
//           />
//         </div>
//         <div>
//           <label>Result Color</label>
//           <select
//             value={resultColor}
//             onChange={(e) => setResultColor(e.target.value)}
//             required
//             aria-label="Result color"
//           >
//             <option value="">Select Color</option>
//             <option value="Green">Green</option>
//             <option value="Red">Red</option>
//           </select>
//         </div>
//         <button type="submit">Set Result</button>
//         <button type="button" onClick={onClose}>Cancel</button>
//       </form>
//     </div>
//   );
// }

// export default ResultForm;


import React, { useState } from 'react';
import './ResultForm.css'; // CSS for styling

function ResultForm({ period, onClose, onSetResult }) {
  const [resultNumber, setResultNumber] = useState('');
  const [resultColor, setResultColor] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Client-side validation
    if (!resultNumber || !resultColor) {
      setError('Please provide both number and color');
      setIsSubmitting(false);
      return;
    }
    const number = Number(resultNumber);
    if (!Number.isInteger(number) || number < 0 || number > 9) {
      setError('Number must be an integer between 0 and 9');
      setIsSubmitting(false);
      return;
    }
    if (!['Green', 'Red'].includes(resultColor)) {
      setError('Invalid color');
      setIsSubmitting(false);
      return;
    }

    try {
      // Make API call to set round outcome
      const response = await fetch(`/api/rounds/${period}/outcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include JWT token for authentication
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ resultNumber: number, resultColor }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set round outcome');
      }

      const result = await response.json();
      console.log('Round outcome set:', result);

      // Notify parent component (e.g., AdminDashboard)
      onSetResult(period, { resultNumber: number, resultColor });

      // Close the form
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while setting the result');
      console.error('Error setting round outcome:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="result-form-container" role="dialog" aria-labelledby="result-form-title">
      <div className="result-form">
        <h3 id="result-form-title">Set Result for {period}</h3>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="result-number">Result Number (0-9)</label>
            <input
              id="result-number"
              type="number"
              min="0"
              max="9"
              value={resultNumber}
              onChange={(e) => setResultNumber(e.target.value)}
              required
              aria-label="Result number"
              disabled={isSubmitting}
              aria-describedby="result-number-error"
            />
          </div>
          <div className="form-group">
            <label htmlFor="result-color">Result Color</label>
            <select
              id="result-color"
              value={resultColor}
              onChange={(e) => setResultColor(e.target.value)}
              required
              aria-label="Result color"
              disabled={isSubmitting}
              aria-describedby="result-color-error"
            >
              <option value="">Select Color</option>
              <option value="Green">Green</option>
              <option value="Red">Red</option>
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Set Result'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Cancel setting result"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResultForm;
