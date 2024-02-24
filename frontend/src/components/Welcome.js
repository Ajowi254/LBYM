// Welcome.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import './Welcome.css';

function Welcome() {
  const history = useHistory();
  const [firstLogin, setFirstLogin] = useLocalStorage("firstLogin", "true");

  // If the user has already seen the welcome page, redirect them to the dashboard
  if (firstLogin === "false") {
    history.push('/dashboard');
    return null;
  }

  const handleGetStarted = () => {
    setFirstLogin("false"); // Set firstLogin to false after the user has seen the welcome page
    history.push('/intro');
  };

  const handleSkip = () => {
    setFirstLogin("false"); // Set firstLogin to false if the user skips the welcome page
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
