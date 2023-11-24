//registerform.js
import ExpenseBudApi from '../../api/api';
import { useState } from 'react';
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
  firstName: '',
  lastName: '',
  email: '',
};

function RegisterForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [registrationError, setRegistrationError] = useState({});
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError({}); // Reset registration errors

    try {
      const response = await ExpenseBudApi.register(formData);

      if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        window.location.href = '/dashboard';
      } else {
        setRegistrationError({
          message: 'Token not found in the response data.',
        });
        // Handle this case, maybe show a user-friendly error message on the webpage
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setRegistrationError({
          message: 'Registration failed. Check your inputs.',
        });
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
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="dense"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoFocus
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
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
        <TextField
          margin="dense"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
        {registrationError.message && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {registrationError.message}
          </div>
        )}
        <Grid container>
          <Grid item>
            <Link href="/login" variant="body2">
              {"Already have an account? Login"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default RegisterForm;