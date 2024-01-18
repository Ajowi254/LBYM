// SetGoal.js
import React from 'react';
import './Setgoal.css'; // Import the CSS file

function SetGoal() {
  const goalIconPath = "/screenshots/Frame 85.svg";

  return (
    <div className="goal-container"> {/* Add a container for the goal icon */}
      <img src={goalIconPath} alt="Goal Icon" className="goal-icon" />
      {/* Remove the navigation bar */}
    </div>
  );
}

export default SetGoal;
