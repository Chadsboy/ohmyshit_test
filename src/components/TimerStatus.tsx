import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import { useTimerStore } from "../store/timerStore";
import { useNavigate } from "react-router-dom";

const TimerStatus: React.FC = () => {
  const { isActive, time } = useTimerStore();
  const navigate = useNavigate();

  // 시간을 MM:SS 형식으로 변환
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isActive) return null;

  return (
    <Tooltip title="타이머로 이동">
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TimerIcon />
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {formatTime()}
          </Typography>
        </Box>
      </IconButton>
    </Tooltip>
  );
};

export default TimerStatus;
