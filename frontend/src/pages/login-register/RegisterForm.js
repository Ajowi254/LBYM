//registerform.js
import { AxiosError } from 'axios';
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

    // Validate user input
    if (!formData.username || !formData.email) {
      setRegistrationError({
        message: 'Username and email are required.',
      });
      return;
    }

    try {
      const token = await ExpenseBudApi.register(formData);
      localStorage.setItem('userToken', token);
      history.push('/login'); // Redirect to login page after successful registration
    } catch (error) {
      if (error instanceof AxiosError) {
        // Access the error message from the server response
        const errorMessage = error.response.data.error;
        if (errorMessage.includes('Username already exists')) {
          setRegistrationError({
            message: 'Username already exists. Please choose a different username.',
          });
        } else {
          console.error('Unexpected error:', errorMessage);
          // Handle other errors
        }
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