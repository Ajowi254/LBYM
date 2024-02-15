//navwithdrawer.js
import React, { useState, useContext, useRef } from "react";
import UserContext from "../context/UserContext";
import { NavLink, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import Navbar from "./Nav";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";
import "./NavWithDrawer.css";

import { ReactComponent as HomeIcon } from '../assets/Property 1=Home.svg';
import { ReactComponent as GoalsIcon } from '../assets/Property 1=Goals.svg';
import { ReactComponent as StoreIcon } from '../assets/Property 1=Store.svg';
import { ReactComponent as AlertsIcon } from '../assets/Property 1=Alerts.svg';
import { ReactComponent as BlobIcon } from '../assets/Blob (1).svg';

const drawerItems = [
  { name: 'Home', icon: <HomeIcon />, path: '/home' },
  { name: 'Goals', icon: <GoalsIcon />, path: '/goals' },
  { name: 'Accounts', icon: <StoreIcon />, path: '/accounts' },
  { name: 'Dashboard', icon: <AlertsIcon />, path: '/dashboard' },
];

function NavWithDrawer({ logout, hideAvatar }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const imageUploader = useRef(null);
  const [imageUrl, setImageUrl] = useState(currentUser?.profileImg || '');
  const location = useLocation();

  const handleImageUpload = async (e) => {
    const [file] = e.target.files;
    if (file) {
      try {
        const uploadedUrl = await uploadImageToCloudinary(file);
        setCurrentUser((prevUser) => ({ ...prevUser, profileImg: uploadedUrl }));
        setImageUrl(uploadedUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };const drawer = (
    <div className='NavWithDrawer'>
      <List style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 20px' }}>
        {drawerItems.map((item, index) => (
          <ListItem key={item.name} disablePadding style={{ flex: index === 0 || index === drawerItems.length - 1 ? '0.5' : '1.5' }}>
            <ListItemButton>
              <NavLink 
                to={item.path} 
                activeClassName="active"
              >
                <div className="icon-container">
                  {location.pathname === item.path && <BlobIcon className="blob-icon" />}
                  {item.icon}
                </div>
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
      <Navbar logout={logout} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: '20px' }}>
        {currentUser && !hideAvatar && ( // Use hideAvatar to decide whether to render the avatar or not
          <>
            <Avatar
              sx={{ width: 36, height: 36 }}
              src={imageUrl}
              onClick={() => imageUploader.current.click()}
              alt={currentUser.username[0]}
            />
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              ref={imageUploader}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
      {currentUser && drawer}
    </Box>
  );
}

export default NavWithDrawer;
