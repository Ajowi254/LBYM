//NavWithDrawer.js
import React, { useState, useContext, useRef } from "react";
import UserContext from "../context/UserContext";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Navbar from "./Nav";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";
import "./NavWithDrawer.css";

const drawerItems = ['Home', 'Goals', 'Accounts', 'Dashboard'];

function NavWithDrawer({ logout }) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const imageUploader = useRef(null);
  const [imageUrl, setImageUrl] = useState(currentUser?.profileImg || '');

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
  };

  const drawer = (
    <div className='NavWithDrawer'>
      <List style={{ display: 'flex', flexDirection: 'row' }}>
        {drawerItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton>
              <NavLink 
                to={`/${item.toLowerCase()}`} 
                activeClassName="active"
              >
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
        {currentUser && (
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
