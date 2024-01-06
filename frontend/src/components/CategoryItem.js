import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

// Define a custom thumb component for the slider
const CustomThumb = styled(SliderThumb)({
  height: 24,
  width: 24,
  backgroundColor: '#fff',
  border: '2px solid currentColor',
  '&:hover': {
    boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.16)',
  },
  '& .bar': {
    height: 9,
    width: 1,
    backgroundColor: 'currentColor',
    marginLeft: 1,
    marginRight: 1,
  },
});

function CategoryItem({ icon, name, budget, onBudgetChange }) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      py: 1,
      borderBottom: '1px solid #A0A0A0',
      '&:last-child': {
        borderBottom: 'none',
      },
    }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>
        {name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box component="img" src={icon} alt={name} sx={{ width: '64px', height: '64px', mr: 2 }} />
        <Slider
          components={{ Thumb: CustomThumb }}
          value={budget}
          onChange={(event, newValue) => onBudgetChange(name, newValue)}
          aria-labelledby="input-slider"
          min={0}
          max={1000} // Set the maximum budget value here
          valueLabelDisplay="auto"
          sx={{ width: '100%' }} // This will make the slider take the full width available
        />
      </Box>
    </Box>
  );
}

export default CategoryItem;
