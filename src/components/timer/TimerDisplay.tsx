import React from "react";
import { Box, Typography } from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import { css } from "@emotion/react";

// 페이드 인 아웃 애니메이션 정의
// 주의: 우리는 타이머 컴포넌트에서 이미 전역적으로 정의했기 때문에
// 여기서는 animation 속성만 참조합니다.

interface TimerDisplayProps {
  time: number; // 초 단위 시간
  isActive: boolean; // 타이머 활성화 상태
  secondChanged: boolean; // 초가 변경되었는지 여부
}

/**
 * 타이머 디스플레이 컴포넌트
 * 시간을 MM:SS 형식으로 표시합니다.
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({
  time,
  isActive,
  secondChanged,
}) => {
  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 2,
      }}
    >
      {/* 타이머 제목 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <TimerIcon
          sx={{
            mr: 1,
            color: isActive ? "primary.main" : "text.secondary",
          }}
        />
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 500,
            color: isActive ? "primary.main" : "text.secondary",
          }}
        >
          Sh!t Start !
        </Typography>
      </Box>

      {/* 타이머 시간 표시 */}
      <Typography
        variant="h2"
        component="div"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "3rem", sm: "4rem" },
          fontFamily: "monospace",
          letterSpacing: "0.1em",
          color: isActive ? "primary.main" : "text.primary",
          animation: isActive ? "pulsate 3s infinite ease-in-out" : "none",
          display: "inline-block",
          lineHeight: 1.2,
          mt: 1,
          mb: 2,
          position: "relative",
          "&::after": isActive
            ? {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "3px",
                background: (theme) =>
                  `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                borderRadius: "3px",
              }
            : {},
        }}
      >
        {formatTime(time)}
      </Typography>
    </Box>
  );
};

export default TimerDisplay;
