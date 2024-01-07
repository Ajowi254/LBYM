//CategoryProgress,js
import React from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CategoryProgress({ name, currentSpending, budget }) {
  const progress = budget > 0 ? (currentSpending / budget) * 100 : 0;
  const overBudget = progress > 100;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6">{name}</Typography>
      {budget > 0 && (
        <>
          <Typography variant="body1">{`Spent: $${currentSpending} / Budget: $${budget}`}</Typography>
          <LinearProgress variant="determinate" value={progress} color={overBudget ? "secondary" : "primary"} />
        </>
      )}
      {overBudget && (
        <Typography variant="body2" color="error">
          Over budget!
        </Typography>
      )}
    </Box>
  );
}

export default CategoryProgress;
