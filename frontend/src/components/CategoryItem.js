import React, { useState, useEffect, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import './CategoryItem.css';
import ExpenseBudApi from '../api/api';

const CustomThumb = forwardRef((props, ref) => (
  <div ref={ref} {...props} className="custom-slider-thumb" />
));

function CategoryItem({ icon, name, initialBudget, userId, categoryId, onBudgetChange }) {
  const [budget, setBudget] = useState(initialBudget);

  // Update the budget state when initialBudget changes
  useEffect(() => {
    setBudget(initialBudget);
  }, [initialBudget]);

  const handleSliderChange = (event, newValue) => {
    setBudget(newValue);
  };

  const handleSliderChangeCommitted = async () => {
    try {
      const updatedBudget = await ExpenseBudApi.setOrUpdateBudget(userId, categoryId, budget);
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
          value={budget}
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
