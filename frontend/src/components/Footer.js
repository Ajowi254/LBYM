import { useContext } from 'react';

import UserContext from '../context/UserContext';

import './Footer.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';

const drawerWidth = 140;

function Footer() {
  const { currentUser } = useContext(UserContext);
  return (
    <AppBar position="fixed" color="primary" className="Footer" sx={{ 
      top: 'auto', 
      bottom: 0,
      backgroundColor: '#045681',
      width: currentUser? { sm: `calc(100% - ${drawerWidth}px)` } : {},
      ml: currentUser? { sm: `${drawerWidth}px` } : {},
      }}>
      <Toolbar>
        <Typography variant="body2" color="inherit">
          LYBM. 2023 | <a href="https://github.com/Ajowi254/LYBM-project" target="_blank" rel="noreferrer"><GitHubIcon color='secondary'/></a>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
