// CategoryItem.js
import React, { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './CategoryItem.css';

function CategoryItem({ icon, name, budget, spent = 0 }) {
  const budgetNumber = Number(budget);
  const spentNumber = Number(spent);
  const spentWithinBudget = Math.min(spentNumber, budgetNumber);
  const spentOverBudget = Math.max(0, spentNumber - budgetNumber);
  const sliderRef = useRef();
  const thumbValueRef = useRef();
  const [sliderValue, setSliderValue] = useState(spentWithinBudget + spentOverBudget);

  // Add a state for the slider color
  const [sliderColor, setSliderColor] = useState('#1A535C');

  useEffect(() => {
    const slider = sliderRef.current;
    const thumbValue = thumbValueRef.current;

    const updateThumbValuePosition = () => {
      const percent = (spentNumber / (budgetNumber + spentOverBudget)) * 100;
      thumbValue.style.left = `calc(${percent}% - ${thumbValue.offsetWidth / 2}px)`;
    };

    slider.addEventListener('input', updateThumbValuePosition);
    window.addEventListener('resize', updateThumbValuePosition);

    updateThumbValuePosition();

    // Update the slider color based on the budget and spent amount
    if (budgetNumber === 0 && spentNumber > 0) {
      setSliderColor('#1A535C');
    } else if (spentNumber <= 0) {
      setSliderColor('transparent');
    } else if (spentNumber > budgetNumber) {
      setSliderColor('red');
    } else {
      setSliderColor('#1A535C');
    }

    return () => {
      slider.removeEventListener('input', updateThumbValuePosition);
      window.removeEventListener('resize', updateThumbValuePosition);
    };
  }, [spentNumber, budgetNumber, spentOverBudget]);

  return (
    <Box className="category-item" style={{ backgroundColor: 'transparent' }}>
      <Typography variant="subtitle1" className="category-name">
        {name}
      </Typography>
      <Box className="slider-container">
        <Box component="img" src={icon} alt={name} className="category-icon" />
        <div className="slider-wrapper">
          <input
            ref={sliderRef}
            type="range"
            min="0"
            max={budgetNumber + spentOverBudget}
            value={sliderValue}
            disabled
            className="slider-style"
          />
          <div
            className="slider-fill"
            style={{ width: `${(spentWithinBudget / (budgetNumber + spentOverBudget)) * 100}%`, backgroundColor: sliderColor }}
          />
          <div
            className="slider-fill-overbudget"
            style={{ width: `${(spentOverBudget / (budgetNumber + spentOverBudget)) * 100}%`, backgroundColor: '#FF6B6B' }}
          />
          <div ref={thumbValueRef} className="thumb-value" style={{ color: spentNumber > budgetNumber ? 'red' : '#1A535C' }}>
            ${spentNumber}
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default CategoryItem;
