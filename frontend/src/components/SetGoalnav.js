// SetGoalnav.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SetGoalnav.css';

function SetGoalnav({ setCurrentStep }) {
  return (
    <div className="navbar">
      <button className="nav-button" id="back" onClick={() => setCurrentStep(prevStep => prevStep - 1)}>Back</button>
      <Link className="nav-button" id="skip" to="/home">Skip</Link>
      <button className="nav-button" id="next" onClick={() => setCurrentStep(prevStep => prevStep + 1)}>Next</button>
    </div>
  );
}

export default SetGoalnav;
