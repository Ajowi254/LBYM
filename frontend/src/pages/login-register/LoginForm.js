//loginform.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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

function LoginForm({ login }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [formErrors, setFormErrors] = useState([]);
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData);
      console.log("Login result: ", result); // Add this line
      if (result.success) {
        history.push('/welcome');
      } else {
        setFormErrors(result.err);
      }
    } catch (error) {
      console.error("Login error: ", error);
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
  error={formErrors.length > 0} // Change this line
  helperText={formErrors.length > 0 ? 'Incorrect username/password' : null}
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
  error={formErrors.length > 0} // And this line
  helperText={formErrors.length > 0 ? 'Incorrect username/password' : null}
/>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: '#FF6B6B',
            width: '138px',
            height: '48px',
            borderRadius: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto', // Add this line to center the button horizontally
          }}
        >
          Login
        </Button>
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
