// Landing.js
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import Welcome from '../../components/Welcome'; // Corrected path
import Intro from '../../components/Intro'; // Corrected path
import ConnectBank from '../../components/ConnectBank'; // Corrected path
import SetGoals from '../../components/Setgoals'; // Corrected path
import GrantPermission from '../../components/Grantpermission'; // Corrected path

import './Landing.css';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function Landing() {
  const [step, setStep] = useState(0);
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      history.push('/dashboard');
    }
  }, [currentUser, history]);

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handleBack = () => setStep((prevStep) => prevStep - 1);
  const handleSkip = () => setStep(4); // Assuming you have 4 steps

  return (
    <div className="Landing">
      <Toolbar />
      {step === 0 && <Welcome onNext={handleNext} />}
      {step === 1 && <Intro onNext={handleNext} onSkip={handleSkip} />}
      {step === 2 && <SetGoals onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <GrantPermission onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <ConnectBank onBack={handleBack} onSkip={handleSkip} />}
      {step === 5 && (
        <Grid container className="Landing-grid">
          <Grid item xs={12} md={5} className="Landing-grid-img"/>
          <Grid item xs={12} md={6} sx={{pl:3}}>
            <Typography component="h1" variant="h4" sx={{fontWeight: 'bold', my: 2}}>
              Personal expense tracking & budgeting made simple
            </Typography>
            <Typography component="p" variant="subtitle1" sx={{mb: 3}}>
              Sync your credit card expenses with one click
            </Typography>
            <Button variant="contained" size="large" sx={{mt: 2}} disableElevation onClick={() => history.push('/register')}>Get started today</Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default Landing;
