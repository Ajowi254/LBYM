import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; // Import useHistory
import ExpenseBudApi from '../api/api';
import UserContext from '../context/UserContext';
import './GrantpermNav.css';

function GrantpermNav() {
  const { currentUser } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const history = useHistory(); // Get the history object

  const fetchNotifications = async () => {
    try {
      const fetchedNotifications = await ExpenseBudApi.getNotifications(currentUser.id);
      setNotifications(fetchedNotifications);
      history.push('/home'); // Navigate to the homepage
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  return (
    <div className="navbar">
      <Link className="nav-button" id="back" to="/intro" style={{ textDecoration: 'none', color: 'inherit' }}>Back</Link>
      <Link className="nav-button" id="skip" to="/home">Skip</Link>
      <button className="nav-button" id="grantaway" onClick={fetchNotifications}>
        Grant Away
      </button>
    </div>
  );
}

export default GrantpermNav;
