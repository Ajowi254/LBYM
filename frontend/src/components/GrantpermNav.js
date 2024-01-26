//GrantpermNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import './GrantpermNav.css';

function GrantpermNav() {
  return (
    <div className="navbar">
      <Link className="nav-button" id="back" to="/intro" style={{ textDecoration: 'none', color: 'inherit' }}>Back</Link>
      <Link className="nav-button" id="skip" to="/home">Skip</Link>
      <button className="nav-button" id="grantaway">
      
      </button>
    </div>
  );
}

export default GrantpermNav;
