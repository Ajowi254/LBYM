//profileform.js
import { useState, useContext } from "react";

import UserContext from "../../context/UserContext";
import ExpenseBudApi from "../../api/api";
import FlashMsg from "../../components/FlashMsg";
import DialogModal from "../../components/DialogModal";
import errorMap from "../../utils/errorMap";

import './ProfileForm.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


function ProfileForm() {
  const {currentUser, setCurrentUser } = useContext(UserContext);

  const INITIAL_STATE = {
    username: currentUser.username,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    password: '',
    email: currentUser.email
  }

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(false);

  console.debug(
    "ProfileForm",
    "formData=", formData,
    "formErrors=", formErrors
  )
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(data => ({...data, [name]: value}));
    setFormErrors([]);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    let updatedUser;
    try {
      updatedUser = await ExpenseBudApi.updateProfile(currentUser.id, formData);
      
    } catch (err) {
      if(err.includes('Invalid password')){
        const index = err.indexOf('Invalid password')
        err[index] = 'instance.password'
      } 
      let errors = errorMap(err)
      setFormErrors(errors);
      return;
    }

    setFormData(data => ({...data, password: ''}));
    setFormErrors({});
    setSaveStatus(true);
    setCurrentUser(updatedUser);
  }

  const handleDelete = async() => {
    try {
      await ExpenseBudApi.deleteUser(currentUser.id);
      setCurrentUser(null);
    } catch (err) {
      return {success: false, err};
    }
  }

  return (
    <Container maxWidth="xs" className="ProfileForm">
      <Typography component="h1" variant="h5">
            Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="dense"
          fullWidth
          autoFocus
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
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={formErrors.firstName}
          helperText={formErrors.firstName? 'First Name cannot be blank': null}
        />
        <TextField
          margin="dense"
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
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          helperText={formErrors.email? 'Invalid email': null}
        />
        <Typography variant="caption">Confirm password to make changes:</Typography>
        <TextField
          margin="dense"
          fullWidth
          required
          name="password"
          label="Password"
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          helperText={formErrors.password? 'Incorrect password': null}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save Changes
        </Button>
        <DialogModal 
          buttonMsg="Delete Account"
          title="Delete Account?"
          content="Deleting your account will delete your access and all your information on this site."
          handleDelete={handleDelete}
        />
      </Box>
      {saveStatus && <FlashMsg type='success' messages={['Changes updated successfully.']} />}
    </Container>
    
  )
}


export default ProfileForm;