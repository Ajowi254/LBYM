import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
 
function Main({children}) {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, pl: { xs: 5, sm: 20 }, pb: { xs: 3, sm: 15 }, pt: 2, width: { sm: `calc(100% - 140px)` } }}
    >
      <Toolbar />
      {children}
    </Box>
  )
}

export default Main;