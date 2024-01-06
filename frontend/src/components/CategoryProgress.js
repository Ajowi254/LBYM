//CategoryProgress.js
import React from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CategoryProgress({ name, currentSpending, budget }) {
  const progress = budget > 0 ? (currentSpending / budget) * 100 : 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6">{name}</Typography>
      <Typography variant="body1">{`$${currentSpending} of $${budget}`}</Typography>
      <LinearProgress variant="determinate" value={progress} color={progress > 100 ? "secondary" : "primary"} />
      {progress > 100 && (
        <Typography variant="body2" color="error">
          Over budget!
        </Typography>
      )}
    </Box>
  );
}

export default CategoryProgress;
