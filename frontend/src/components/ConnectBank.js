//ConnectBank.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './ConnectBank.css'; // Make sure the CSS file is in the same directory

function ConnectBank({ step }) {
  const history = useHistory();

  const handleConnect = () => {
    // Define what happens when "Connect" is clicked
    history.push('/set-goals'); // Replace with your actual next step route
  };

  const handleSkip = () => {
    history.push('/login'); // Navigate to the login page
  };

  const handleBack = () => {
    history.goBack(); // Go back to the previous page
  };

  // Update the path to your SVG files correctly
  const iconPath = "/screenshots/Frame 66 (1).svg"; // Path to your Connect Bank Icon
  const contentIconPath = "/screenshots/Frame 76.svg"; // Path to your additional SVG

  return (
    <div className="connect-bank-container">
      <div className="progress-indicator">
        <div className={`progress-step ${step === 1 ? 'active' : ''}`}>Step 1</div>
        <div className={`progress-step ${step === 2 ? 'active' : ''}`}>Step 2</div>
        <div className={`progress-step ${step === 3 ? 'active' : ''}`}>Step 3</div>
        {/* Add more steps if necessary */}
      </div>
      <img src={iconPath} alt="Connect Bank Icon" className="connect-bank-icon" />
      <img src={contentIconPath} alt="Content Icon" className="content-icon" />
      <div className="connect-buttons">
        <button className="connect-button" onClick={handleConnect}>Connect</button>
        <button className="skip-button" onClick={handleSkip}>Skip</button>
        <button className="back-button" onClick={handleBack}>Back</button>
      </div>
    </div>
  );
}

export default ConnectBank;
