import React from 'react';
import { useHistory } from 'react-router-dom';
import './Welcome.css'; // Ensure this path is correct

function Welcome() {
  const history = useHistory();

  const handleGetStarted = () => {
    history.push('/intro');
  };

  const handleSkip = () => {
  
  };

  return (
    
    <div className="welcome-container">
      <div className="icon-container">
        <img src="/screenshots/App Attribution.svg" alt="Leaf Icon" />
      </div>
      <div className="welcome-sign">
        <img src="/screenshots/Frame 55.svg" alt="Welcome Sign" />
      </div>
      <div className="action-buttons">
        <button className="get-started" onClick={handleGetStarted}>Get Started</button>
        <button className="skip" onClick={handleSkip}>Skip</button>
      </div>
    </div>
  );
}

export default Welcome;
