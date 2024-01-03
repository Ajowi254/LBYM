//NavWithDrawer.js
import React, { useState, useEffect, useContext } from 'react'; // Import useState, useEffect, and useContext hooks
import { NavLink } from 'react-router-dom';

import UserContext from '../context/UserContext';
import Navbar from './Nav';

import './NavWithDrawer.css';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar'; // Import the Avatar component
import { uploadImage } from '../pages/profile/imageUploadService'; // Fix the import path

const drawerItems = ['Dashboard','Accounts', 'Budgets', 'Expenses'];

function NavWithDrawer({logout}) {
  const { currentUser } = useContext(UserContext); // Use the useContext hook to access the UserContext
  const [profileImg, setProfileImg] = useState(null); // Use the profileImg state to store the user's profile picture URL

  useEffect(() => {
    // Use the useEffect hook to upload the user's profile picture to the backend server and get the URL
    async function handleImageUpload() {
      if (currentUser.profileImg) {
        const url = await uploadImage(currentUser.id, currentUser.profileImg);
        setProfileImg(url);
      }
    }
    handleImageUpload();
  }, [currentUser]);

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
          )
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', paddingBottom: '50px' }}>
      <Navbar logout={logout} profileImg={profileImg} /> // Pass the profileImg as a prop to the Navbar component
      <Avatar src={profileImg}>{currentUser.username[0]}</Avatar>
      {currentUser && drawer}
    </Box>
  );
}

export default NavWithDrawer;
