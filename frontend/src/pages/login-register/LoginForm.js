//loginform.js
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ExpenseBudApi from '../../api/api'; // import your API class

import './Login-RegisterForm.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const INITIAL_STATE = {
  username:'',
  password: ''
}
function LoginForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [formErrors, setFormErrors] = useState([]);
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await ExpenseBudApi.login(formData);
      
      if (result.token) {
        // Assuming your login function returns a token
        const token = result.token;
        // Store the token in your preferred way (e.g., localStorage)
        
        // Redirect to the next page or perform any other necessary action
        history.push('/');
        setFormData(INITIAL_STATE);
        setFormErrors([]);
      }
    } catch (error) {
      setFormErrors([error.message]); // Adjust this based on your error response structure
    }
  }
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
          error={!!formErrors.username} // convert to boolean
          helperText={formErrors.username ? 'Username needs to be between 5-20 characters' : null}
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
          error={!!formErrors.password} // convert to boolean
          helperText={formErrors.password ? 'Password needs to be between 5-20 characters' : null}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
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
  )
}

export default LoginForm;