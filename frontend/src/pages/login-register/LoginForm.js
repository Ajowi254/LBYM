//loginform.js
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ExpenseBudApi from '../../api/api';

import './Login-RegisterForm.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const INITIAL_STATE = {
  username: '',
  password: '',
};

function LoginForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loginError, setLoginError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(''); // Reset login error
  
    try {
      const token = await ExpenseBudApi.login(formData);
  
      if (token) {
        console.log('Generated token:', token);
        localStorage.setItem('userToken', token);
        history.push('/dashboard');
      } else {
        setLoginError('Token not found in the response data.');
        // Handle this case, maybe show a user-friendly error message on the webpage
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginError('Invalid username/password');
        // Display this error on the webpage
      } else {
        console.error('Unexpected error:', error);
        // Handle other errors
      }
    }
  };
  
  return (
    <Container maxWidth="sm" className="Login-RegisterForm">
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="dense"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoFocus
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Login
        </Button>
        {loginError && (
          <div style={{ color: 'red', marginTop: '10px' }}>{loginError}</div>
        )}
        <Grid container>
          <Grid item xs>
            <Link href="/register" variant="body2">
              {"Don't have an account? Register"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default LoginForm;