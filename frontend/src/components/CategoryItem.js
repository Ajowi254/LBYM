import React, { useState, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import './CategoryItem.css';
import ExpenseBudApi from '../api/api';

const CustomThumb = forwardRef((props, ref) => (
  <div ref={ref} {...props} className="custom-slider-thumb" />
));

function CategoryItem({ icon, name, initialBudget = 0, userId, categoryId, budgetId, onBudgetChange }) {
  const [budget, setBudget] = useState(initialBudget);

  const handleSliderChange = (event, newValue) => {
    setBudget(newValue);
  };

  const handleSliderChangeCommitted = async (event, newValue) => {
    if (!userId) {
      console.error('UserId is undefined. Cannot set or update budget.');
      return;
    }
    try {
      let updatedBudget;
      if (budgetId) {
        updatedBudget = await ExpenseBudApi.updateBudget(userId, categoryId, budget);
      } else {
        updatedBudget = await ExpenseBudApi.setBudget(userId, categoryId, budget);
      }
      onBudgetChange(name, updatedBudget.budgetLimit);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };
  return (
    <Box className="category-item">
      <Typography variant="subtitle1" className="category-name">
        {name}
      </Typography>
      <Box className="slider-container">
        <Box component="img" src={icon} alt={name} className="category-icon" />
        <Slider
          components={{ Thumb: CustomThumb }}
          value={typeof budget === 'number' ? budget : 0}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          aria-labelledby="input-slider"
          min={0}
          max={1000}
          valueLabelDisplay="on"
          track={false}
        />
        <Typography className="budget-value">
          ${budget}
        </Typography>
      </Box>
    </Box>
  );
}

export default CategoryItem;
