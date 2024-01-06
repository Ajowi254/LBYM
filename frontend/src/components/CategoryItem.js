// CategoryItem.js
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

function CategoryItem({ icon, name }) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column', // Elements are stacked vertically
      alignItems: 'flex-start', // Align items to the start of the flex container
      py: 1, // Padding top and bottom for each item
      borderBottom: '1px solid #A0A0A0', // The color you want for separation
      '&:last-child': {
        borderBottom: 'none', // Remove bottom border for the last item
      },
    }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>
        {name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box component="img" src={icon} alt={name} sx={{ width: '64px', height: '64px', mr: 2 }} />
        <LinearProgress sx={{ flexGrow: 1, height: '10px', borderRadius: '5px' }} />
      </Box>
    </Box>
  );
}

export default CategoryItem;
