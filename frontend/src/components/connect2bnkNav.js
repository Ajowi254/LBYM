// Connect2bnkNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import './connect2bnkNav.css';

function Connect2bnkNav() {
  return (
    <div className="navbar connect-navbar">
      <Link className="nav-button connect-nav-button" id="back" to="/intro">Back</Link>
      <Link className="nav-button connect-nav-button" id="skip" to="/home">Skip</Link>
      <button className="nav-button connect-nav-button" id="connect">
        <Link to="/accounts" style={{ textDecoration: 'none', color: 'inherit' }}>Connect</Link>
      </button>
    </div>
  );
}

export default Connect2bnkNav;
