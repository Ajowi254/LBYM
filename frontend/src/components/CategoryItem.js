//categoryitem.js
import React, { useRef, useEffect } from 'react';
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

  useEffect(() => {
    const slider = sliderRef.current;
    const thumbValue = thumbValueRef.current;

    const updateThumbValuePosition = () => {
      const percent = ((spentWithinBudget + spentOverBudget) / (budgetNumber + spentOverBudget)) * 100;
      thumbValue.style.left = `calc(${percent}% - ${thumbValue.offsetWidth / 2}px)`;
    };

    slider.addEventListener('input', updateThumbValuePosition);
    window.addEventListener('resize', updateThumbValuePosition);

    updateThumbValuePosition();

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
            value={spentWithinBudget + spentOverBudget}
            disabled
            className="slider-style"
          />
          {spentNumber > 0 && (
            <div
              className="slider-fill"
              style={{
                width: '100%',
                background: budgetNumber === 0 
                  ? 'green' 
                  : spentNumber <= budgetNumber 
                    ? 'green' 
                    : `linear-gradient(to right, green ${spentWithinBudget / (budgetNumber + spentOverBudget) * 100}%, red ${spentWithinBudget / (budgetNumber + spentOverBudget) * 100}%)`
              }}
            />
          )}
          <div ref={thumbValueRef} className="thumb-value" style={{ color: 'black' }}>
            ${spentNumber}
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default CategoryItem;
