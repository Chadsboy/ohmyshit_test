import React from "react";
import { Box, Typography } from "@mui/material";

const Statistics: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        통계
      </Typography>
      <Typography variant="body1" color="text.secondary">
        이 기능은 개발 중입니다.
      </Typography>
    </Box>
  );
};

export default Statistics;
