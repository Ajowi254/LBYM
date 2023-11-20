import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import errorMap from '../../utils/errorMap';
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
  password: '',
  firstName: '',
  lastName: '',
  email: ''
}

function RegisterForm({register}) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [formErrors, setFormErrors] = useState({});
  const history = useHistory();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(data => ({...data, [name]: value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result = await register(formData);
    if (result.success) {
      history.push('/'); 
      setFormData(INITIAL_STATE);
      setFormErrors({});
    } else {
      let errors = errorMap(result.err);
      setFormErrors(errors);
    }
  }
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
          error={formErrors.firstName}
          helperText={formErrors.firstName? 'First Name cannot be blank': null}
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
          error={formErrors.lastName}
          helperText={formErrors.firstName? 'Last Name cannot be blank': null}
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
          error={formErrors.username}
          helperText={formErrors.username? 'Username needs to be between 5-20 characters': null}
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
          error={formErrors.password}
          helperText={formErrors.password? 'Password needs to be between 5-20 characters': null}
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
          error={formErrors.email}
          helperText={formErrors.email? 'Invalid email': null}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/login" variant="body2">
              {"Already have an account? Login"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    
    </Container>
   
  )
}

export default RegisterForm;