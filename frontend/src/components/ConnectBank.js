// ConnectBank.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './ConnectBank.css';
import Connect2bnkNav from './connect2bnkNav'; // Import the Connect2bnkNav component

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
      <Connect2bnkNav />
    </div>
  );
}

export default ConnectBank;
