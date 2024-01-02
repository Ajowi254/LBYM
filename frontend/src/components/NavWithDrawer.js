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

const drawerItems = ['Dashboard','Accounts', 'Budgets', 'Expenses'];

function NavWithDrawer({logout}) {
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
      {currentUser && drawer}
    </Box>
  );
}

export default NavWithDrawer;
