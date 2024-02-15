// Navbar.js
import { useContext, useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ReactComponent as DateIcon } from '../assets/Date (3).svg';
import { ReactComponent as CreditScoreIcon } from '/home/spuser/plaid/LYBM-BE/frontend/src/assets/Frame 50.svg';

import UserContext from '../context/UserContext';
import userInitials from '../utils/userInitials';

import './Nav.css';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Navbar() {
  const { currentUser } = useContext(UserContext);
  const initials = currentUser ? userInitials(currentUser) : "";
  const [date, setDate] = useState(new Date().getDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date().getDate());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppBar component="nav" position="fixed" sx={{ backgroundColor: '#FFFFFF', width: '100%', height: '64px' }}>
      <Toolbar>
        <div className="date-icon">
          <DateIcon />
          <span className="date">{date}</span>
        </div>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, textAlign: 'center' }}>
          <CreditScoreIcon style={{ marginTop: '15px' }} /> {/* Add a margin to the top of the CreditScoreIcon */}
        </Typography>
        {currentUser ? (
          <Link to="/profile" className="avatar-link">
            <Avatar sx={{ width: 36, height: 36 }} src={currentUser.profileImg || ''}>
              {!currentUser.profileImg && initials}
            </Avatar>
          </Link>
        ) : (
          <div className="auth-links">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
