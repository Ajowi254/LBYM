//ConnectBank.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './ConnectBank.css';

function ConnectBank({ step }) {
  const history = useHistory();

  const handleConnect = () => {
    history.push('/set-goals');
  };

  const handleSkip = () => {
    history.push('/login');
  };

  const handleBack = () => {
    history.goBack();
  };

  const iconPath = "/screenshots/Frame 66 (1).svg";
  const contentIconPath = "/screenshots/Frame 76.svg";

  return (
    <div className="connect-bank-container">
      <div className="progress-indicator">
        <div className={`progress-step ${step === 1 ? 'active' : ''}`}>Step 1</div>
        <div className={`progress-step ${step === 2 ? 'active' : ''}`}>Step 2</div>
        <div className={`progress-step ${step === 3 ? 'active' : ''}`}>Step 3</div>
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
