//NavWithDrawer.js
import { useContext } from 'react';
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

const drawerItems = ['Dashboard','Accounts', 'Budgets', 'Expenses'];

function NavWithDrawer({logout, profileImg}) { // Receive the profileImg prop
  const { currentUser } = useContext(UserContext);

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
      <Navbar logout={logout} />
      <Avatar src={profileImg}>{currentUser.username[0]}</Avatar> // Use the profileImg as the src attribute
      {currentUser && drawer}
    </Box>
  );
}

export default NavWithDrawer;
