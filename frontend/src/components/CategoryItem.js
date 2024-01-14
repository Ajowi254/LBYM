//categoryitem.js
import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import './CategoryItem.css';

const CustomThumb = forwardRef((props, ref) => (
  <div ref={ref} {...props} className="custom-slider-thumb" />
));

function CategoryItem({ icon, name, budget, spent, categoryId }) {
  return (
    <Box className="category-item">
      <Typography variant="subtitle1" className="category-name">
        {name}
      </Typography>
      <Box className="slider-container">
        <Box component="img" src={icon} alt={name} className="category-icon" />
        <Slider
          components={{ Thumb: CustomThumb }}
          value={spent} // Use the spent prop here
          min={0}
          max={budget} // Ensure this is the max budget for the category
          valueLabelDisplay="on"
          track={false}
          sx={{
            '& .MuiSlider-thumb': {
              // Custom styling if needed
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'grey',
            },
            '& .MuiSlider-track': {
              backgroundColor: 'green', // Color of the slider track
            },
          }}
          disabled
        />
        <Typography className="budget-value">
          ${spent} / ${budget}
        </Typography>
      </Box>
    </Box>
  );
}

export default CategoryItem;
