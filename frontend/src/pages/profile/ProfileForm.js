// ProfileForm.js
import React, { useState, useContext, useRef } from "react";
import UserContext from "../../context/UserContext";
import ExpenseBudApi from "../../api/api";
import { uploadImageToCloudinary } from '../../utils/uploadImageToCloudinary';
import FlashMsg from "../../components/FlashMsg";
import DialogModal from "../../components/DialogModal";
import errorMap from "../../utils/errorMap";

import './ProfileForm.css';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

function ProfileForm() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const uploadedImage = useRef(null);
  const imageUploader = useRef(null);

  const INITIAL_STATE = {
    username: currentUser.username,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    password: '',
    email: currentUser.email,
    profileImg: currentUser.profileImg || ''
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(false);

  // Handle Cloudinary Upload
  const handleImageUpload = async (e) => {
    const [file] = e.target.files;
    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        await ExpenseBudApi.updateProfilePic(currentUser.id, imageUrl);
        setCurrentUser((prevUser) => ({ ...prevUser, profileImg: imageUrl }));
        setFormData({ ...formData, profileImg: imageUrl }); 
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleDeleteProfilePic = async () => {
    try {
      await ExpenseBudApi.deleteProfilePic(currentUser.id);
      setCurrentUser((prevUser) => ({ ...prevUser, profileImg: null }));
      setFormData({ ...formData, profileImg: '' });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
    setFormErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await ExpenseBudApi.updateProfile(currentUser.id, formData);
      setCurrentUser(updatedUser);
      setSaveStatus(true);
    } catch (err) {
      const errors = errorMap(err);
      setFormErrors(errors);
    }
  }; // This is where handleSubmit ends

  const handleDelete = async() => {
    try {
      await ExpenseBudApi.deleteUser(currentUser.id);
      setCurrentUser(null);
    } catch (err) {
      return {success: false, err};
    }
  };


  return (
    <Container maxWidth="xs" className="ProfileForm">
      <Typography component="h1" variant="h5">Profile</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
          <Avatar
            ref={uploadedImage}
            src={formData.profileImg || ''}
            alt="Profile"
            style={{ width: "100px", height: "100px", border: "1px solid black" }}
            onClick={() => imageUploader.current.click()}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={imageUploader}
            style={{ display: "none" }}
          />
          {formData.profileImg && (
            <Button variant="outlined" onClick={handleDeleteProfilePic} sx={{ mt: 2 }}>
              Delete Profile Picture
            </Button>
          )}
        </div>
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
  );
}

export default ProfileForm;