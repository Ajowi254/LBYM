//GrantpermNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import './GrantpermNav.css';

function GrantpermNav() {
  return (
    <div className="navbar">
      <Link className="nav-button" id="back" to="/intro" style={{ textDecoration: 'none', color: 'inherit' }}>Back</Link>
      <Link className="nav-button" id="skip" to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Skip</Link>
      <button className="nav-button" id="grantaway">
        <Link to="/plaidlink" style={{ textDecoration: 'none', color: 'inherit' }}>Grant Away</Link>
      </button>
    </div>
  );
}

export default GrantpermNav;
