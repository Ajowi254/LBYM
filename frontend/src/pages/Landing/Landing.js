// Landing.js
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/UserContext';

import './Landing.css';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function Landing() {
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      // Redirect to dashboard if currentUser is truthy
      history.push('/dashboard');
    }
  }, [currentUser]);

  return (
    <div className="Landing">
      <Toolbar /> 
      <Grid container className="Landing-grid">
        <Grid item xs={12} md={5} className="Landing-grid-img"/>
        <Grid item xs={12} md={6} sx={{pl:3}}>
          <Typography component="h1" sx={{fontWeight: 'bold'}}>
            Personal expense tracking & budgeting made simple
          </Typography>
          <Typography component="h3">
            Sync your credit card expenses with one click
          </Typography>
          <Link to="/register"><Button variant="contained" size="large" sx={{mt: 2}} disableElevation>Get started today</Button></Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default Landing;
