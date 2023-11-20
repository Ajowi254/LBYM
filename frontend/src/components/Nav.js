import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';

import UserContext from '../context/UserContext';
import userInitials from '../utils/userInitials';

import './Nav.css';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar'
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';


function Navbar({logout, drawerWidth, handleDrawerToggle}) {
  const { currentUser } = useContext(UserContext);
  const initials = userInitials(currentUser);

  return (
    <AppBar
        component="nav"
        position="fixed"
        sx={{
          backgroundColor: '#045681',
          width: currentUser? { sm: `calc(100% - ${drawerWidth}px)` } : {},
          ml: currentUser? { sm: `${drawerWidth}px` } : {},
        }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          {currentUser? <MenuIcon />: null }
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}><Link to="/">LYBM</Link></Typography>
        {currentUser
        ?(<>
           <Link to="/profile"><Avatar sx={{width: 36, height: 36}}>{initials}</Avatar></Link>
           <Button color="inherit"><Link to="/" onClick={logout}>Logout</Link></Button>
           </>
          )
        :(<>
          <Button color="inherit"><NavLink to="/login">Login</NavLink></Button>
          <Button color="inherit"><NavLink to="/register">Register</NavLink></Button>
          </>)
        }
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

