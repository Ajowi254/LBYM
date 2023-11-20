import { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import UserContext from '../context/UserContext';
import Navbar from './Nav';

import './NavWithDrawer.css';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';


const drawerWidth = 140;

function NavWithDrawer({logout}) {
  const { currentUser } = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerItems = ['Dashboard','Accounts', 'Budgets', 'Expenses'];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className='NavWithDrawer'>
      <Toolbar />
      <List>
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
    <Box sx={{ display: 'flex' }}>
      <Navbar logout={logout} drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle}/>
      {currentUser
      ? <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}> 
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
      </Box>
      : null
      }
    </Box>
  );
}

export default NavWithDrawer;