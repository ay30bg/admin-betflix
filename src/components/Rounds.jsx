// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import RoundList from './RoundList';

// const Rounds = () => {
//   const navigate = useNavigate();

//   const handleSelectRound = (period) => {
//     alert(`Manually setting results for ${period}`); // Replace with modal/form
//   };

//   return (
//     <div className="main-content">
//       <h2>Rounds</h2>
//       <RoundList onSelectRound={handleSelectRound} />
//     </div>
//   );
// };

// export default Rounds;

import React from 'react';
import RoundList from './RoundList';

const Rounds = () => {
  return (
    <div className="main-content">
      <h2>Rounds</h2>
      <RoundList />
    </div>
  );
};

export default Rounds;
