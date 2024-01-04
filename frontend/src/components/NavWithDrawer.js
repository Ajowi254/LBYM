//NavWithDrawer.js
import React, { useState, useContext, useRef } from "react";
import UserContext from "../context/UserContext";
import ExpenseBudApi from '../api/api';// Fix the relative path
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';
import './NavWithDrawer.css';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Navbar from './Nav';
import { NavLink } from 'react-router-dom';

const drawerItems = ['Dashboard', 'Accounts', 'Budgets', 'Expenses'];

function NavWithDrawer({ logout }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const uploadedImage = useRef(null);
  const imageUploader = useRef(null);
  const [imageUrl, setImageUrl] = useState(currentUser?.profileImg || '');

  const handleImageUpload = async (e) => {
    const [file] = e.target.files;
    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        setCurrentUser((prevUser) => ({ ...prevUser, profileImg: imageUrl }));
        // Update the local state to reflect the new image URL
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };


  const drawer = (
    <div className='NavWithDrawer'>
      <List style={{ display: 'flex', flexDirection: 'row' }}>
        {drawerItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton>
              <NavLink to={`/${item.toLowerCase()}`}>
                <ListItemText primary={item} />
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', paddingBottom: '50px' }}>
      <Navbar logout={logout} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: '20px' }}>
        {currentUser ? ( // Check if currentUser is not null
          <Avatar
            sx={{ width: 36, height: 36 }}
            src={imageUrl}
            onClick={() => imageUploader.current.click()}
          >
            {currentUser.username[0]}
          </Avatar>
        ) : null}
        {currentUser && ( // Check if currentUser is not null
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            ref={imageUploader}
            style={{ display: 'none' }}
          />
        )}
      </div>
      {currentUser && drawer} {/* Display drawer only if currentUser is not null */}
    </Box>
  );
}

export default NavWithDrawer;
