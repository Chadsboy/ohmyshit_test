import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import { keyframes } from "@mui/material/styles";

// 숫자가 바뀔 때 페이드 애니메이션
const fadeInOut = keyframes`
  0% { opacity: 0.7; transform: scale(1.02); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

interface TimerDisplayProps {
  time: number;
  isActive: boolean;
  secondChanged: boolean;
}

/**
 * 타이머 시간을 표시하는 컴포넌트
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({
  time,
  isActive,
  secondChanged,
}) => {
  const theme = useTheme();

  // 시간 표시 형식 변환 (MM:SS)
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.03)",
            borderRadius: "50%",
            filter: "blur(15px)",
            zIndex: -1,
            transform: "scale(1.5)",
          }}
        />
        <TimerIcon
          color="primary"
          sx={{
            mr: 1.5,
            fontSize: { xs: 32, sm: 36 },
            filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))",
          }}
        />
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.5px",
            textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          타이머
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: theme.shape.borderRadius,
          background: "transparent",
          boxShadow: "none",
          transition: "all 0.3s ease",
          animation: "none",
        }}
      >
        <Typography
          variant="h2"
          component="div"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2.5rem", sm: "3.5rem" },
            color: isActive
              ? theme.palette.primary.main
              : theme.palette.text.primary,
            textShadow: isActive
              ? "0px 2px 10px rgba(0, 0, 0, 0.15)"
              : "0px 2px 5px rgba(0, 0, 0, 0.1)",
            fontFamily: "'Roboto Mono', monospace",
            letterSpacing: "1px",
            transition: "all 0.3s ease",
            animation: secondChanged ? `${fadeInOut} 0.5s ease-out` : "none",
          }}
        >
          {formatTime()}
        </Typography>
      </Box>
    </>
  );
};

export default TimerDisplay;
