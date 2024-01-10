//categoryitem.js
import React, { useState, useEffect, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import ExpenseBudApi from '../api/api'; // Corrected import path

import './CategoryItem.css';

const CustomThumb = forwardRef((props, ref) => (
  <div ref={ref} {...props} className="custom-slider-thumb" />
));

function CategoryItem({ icon, name, categoryId, budget }) {
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    async function loadSpent() {
      try {
        const expenses = await ExpenseBudApi.getExpensesForCategory(categoryId);
        setSpent(expenses.total || 0); // Set to 0 if there are no expenses
      } catch (error) {
        console.error("Error loading expenses:", error);
        // Handle the error appropriately
      }
    }

    loadSpent();
  }, [categoryId]);

  return (
    <Box className="category-item">
      <Typography variant="subtitle1" className="category-name">
        {name}
      </Typography>
      <Box className="slider-container">
        <Box component="img" src={icon} alt={name} className="category-icon" />
        <Slider
          components={{ Thumb: CustomThumb }}
          value={spent}
          aria-labelledby="input-slider"
          min={0}
          max={budget}
          valueLabelDisplay="on"
          track={false}
          sx={{
            '& .MuiSlider-thumb': {
              // Custom styling can be applied here if needed
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'grey', // Color of the rail
            },
            '& .MuiSlider-track': {
              backgroundColor: 'green', // Color indicating the amount spent
            },
          }}
          disabled // Disables the slider
        />
        <Typography className="budget-value">
          ${spent} / ${budget}
        </Typography>
      </Box>
    </Box>
  );
}

export default CategoryItem;
