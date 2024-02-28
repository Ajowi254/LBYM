//grantpermnav.js
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'; 
import ExpenseBudApi from '../api/api';
import UserContext from '../context/UserContext';
import './GrantpermNav.css';

function GrantpermNav() {
  const { currentUser } = useContext(UserContext);
  const history = useHistory(); // Get the history object

  const fetchRemainingBudget = async () => {
    try {
      const remainingBudget = await ExpenseBudApi.getRemainingBudget(currentUser.id);
      history.push('/home'); // Navigate to the homepage
    } catch (err) {
      console.error('Error fetching remaining budget:', err);
    }
  };

  return (
    <div className="navbar">
      <Link className="nav-button" id="back" to="/intro" style={{ textDecoration: 'none', color: 'inherit' }}>Back</Link>
      <Link className="nav-button" id="skip" to="/home">Skip</Link>
      <button className="nav-button" id="grantaway" onClick={fetchRemainingBudget}>
        Grant Away
      </button>
    </div>
  );
}

export default GrantpermNav;
