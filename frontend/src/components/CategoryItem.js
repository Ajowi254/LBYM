// CategoryItem.js
import React, { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './CategoryItem.css';

function CategoryItem({ icon, name, budget, spent = 0, categoryId }) {
  console.log(`Received props in CategoryItem:`, { icon, name, budget, spent, categoryId }); // Added this line

  const budgetNumber = Number(budget);
  const spentNumber = Number(spent);
  const spentClamped = Math.min(Math.max(spentNumber, 0), budgetNumber);

  const sliderRef = useRef();
  const thumbValueRef = useRef();

  console.log('Spent for category:', categoryId, ':', spent);
  console.log('Budget for category:', categoryId, ':', budget);

  useEffect(() => {
    const slider = sliderRef.current;
    const thumbValue = thumbValueRef.current;

    const updateThumbValuePosition = () => {
      console.log('Updating thumb value position');
      const percent = (slider.value - slider.min) / (slider.max - slider.min);
      thumbValue.style.left = `calc(${percent * 100}% - ${thumbValue.offsetWidth / 2}px)`;
    };

    slider.addEventListener('input', updateThumbValuePosition);
    window.addEventListener('resize', updateThumbValuePosition);

    updateThumbValuePosition();

    return () => {
      slider.removeEventListener('input', updateThumbValuePosition);
      window.removeEventListener('resize', updateThumbValuePosition);
    };
  }, []);

  return (
    <Box className="category-item">
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
            max={budgetNumber}
            value={spentClamped}
            className="slider-style"
          />
          <div ref={thumbValueRef} className="thumb-value">${spentClamped}</div>
        </div>
      </Box>
    </Box>
  );
}

export default CategoryItem;
