// Intro.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Intro.css';

function Intro() {
  const history = useHistory();

  const handleNext = () => {
    history.push('/connect-bank'); // Adjust this path to your actual route for connecting to a bank
  };

  const handleSkip = () => {
    history.push('/login'); // Navigate to the login page
  };

  return (
    <div className="intro-container">
      <img src="/screenshots/Frame 66 (3).svg" alt="Intro Icon" className="intro-icon" />
      <img src="/screenshots/Frame 67.svg" alt="Intro Content" className="intro-content" />
      <button className="lets-do-this" onClick={handleNext}>Let's Do This</button>
      <button className="skip" onClick={handleSkip}>Skip</button>
    </div>
  );
}

export default Intro;
