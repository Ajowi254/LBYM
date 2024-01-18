//SetGoalnav.js
import React from 'react';
import { Link } from 'react-router-dom';
import './SetGoalnav.css';

function SetGoalnav() {
  return (
    <div className="navbar">
      <Link className="nav-button" id="back" to="/intro" style={{ textDecoration: 'none', color: 'inherit' }}>Back</Link>
      <Link className="nav-button" id="skip" to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Skip</Link>
      <button className="nav-button" id="connect">
        <Link to="/plaidlink" style={{ textDecoration: 'none', color: 'inherit' }}>Next</Link>
      </button>
    </div>
  );
}

export default SetGoalnav;
