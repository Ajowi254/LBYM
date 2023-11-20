import { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserContext from '../../context/UserContext';

import './Home.css';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function Home() {
  const {currentUser} = useContext(UserContext);

  return (
    <div className="Home">
      {currentUser
        ? <Redirect to='/dashboard' />
        :(<>
          
            <Toolbar /> 
            <Grid container className="Home-grid">
              <Grid item xs={12} md={5} className="Home-grid-img"/>
              
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
          </>)
      }
    </div>
  )
}

export default Home;