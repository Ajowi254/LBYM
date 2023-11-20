import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/** Loading message used by components that fetch API data. */

function LoadingSpinner() {
  return(
    <Box sx={{ display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center', 
               height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default LoadingSpinner;