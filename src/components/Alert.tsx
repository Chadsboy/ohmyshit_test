import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  keyframes,
  Fade,
} from "@mui/material";
import { NewReleases } from "@mui/icons-material";

// 텍스트 슬라이드 애니메이션 (오른쪽에서 중앙으로)
const slideInKeyframes = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
`;

interface AlertProps {
  isTimerActive?: boolean; // 타이머 활성화 여부
}

const Alert: React.FC<AlertProps> = ({ isTimerActive = false }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  // 뉴스 헤드라인 목록
  const headlines = [
    "건강을 위해 하루 8잔의 물을 마시는 것이 좋습니다",
    "걷기 운동은 심장 건강에 매우 효과적입니다",
    "규칙적인 수면은 면역력 강화에 도움이 됩니다",
    "스트레스 관리가 장기적 건강에 중요합니다",
    "과일과 채소를 매일 5회 이상 섭취하세요",
    "자세를 바르게 유지하여 척추 건강을 지키세요",
    "정기적인 건강 검진으로 질병을 예방하세요",
    "하루 30분 이상 적절한 운동이 필요합니다",
  ];

  // 문구 변경 및 애니메이션 처리
  useEffect(() => {
    if (!isTimerActive) return;

    let timeoutId: NodeJS.Timeout;

    const changeHeadline = () => {
      // 현재 문구 페이드 아웃
      setTextVisible(false);
      setIsAnimating(false);

      // 텍스트가 사라진 후 새 문구로 교체
      timeoutId = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        setTextVisible(true);
        setIsAnimating(true);

        // 애니메이션 종료 후 잠시 대기
        const animDuration = 1200; // 애니메이션 시간 (ms)
        const stayDuration = 3500; // 문구 유지 시간 (ms)

        // 다음 문구 변경 예약
        timeoutId = setTimeout(() => {
          changeHeadline();
        }, animDuration + stayDuration);
      }, 400);
    };

    // 최초 실행
    setIsAnimating(true);

    // 첫 번째 변경을 예약 (애니메이션 + 유지 시간 후)
    timeoutId = setTimeout(() => {
      changeHeadline();
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [headlines.length, isTimerActive]);

  // 타이머가 비활성화되면 Alert도 숨김
  if (!isTimerActive) {
    return null;
  }

  return (
    <Paper
      elevation={5}
      sx={{
        width: "100%",
        py: 1.5,
        overflow: "hidden",
        borderRadius: 0,
        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}30, ${theme.palette.primary.main}20, ${theme.palette.primary.light}30)`,
        backgroundSize: "200% 200%",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
        mx: 0,
        px: 0,
        display: isTimerActive ? "block" : "none", // 타이머 활성화 시에만 표시
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <NewReleases
          color="primary"
          fontSize="small"
          sx={{
            mr: 1.5,
            ml: 2,
            zIndex: 2,
          }}
        />

        <Box
          sx={{
            overflow: "hidden",
            width: "calc(100% - 40px)",
            position: "relative",
            height: "1.5rem", // 텍스트 높이 고정
            display: "flex",
            justifyContent: "center", // 중앙 정렬
          }}
        >
          <Fade in={textVisible} timeout={400}>
            <Typography
              ref={textRef}
              variant="body2"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                whiteSpace: "nowrap",
                animation: isAnimating
                  ? `${slideInKeyframes} 1.2s ease-out forwards`
                  : "none",
                // 애니메이션이 완료된 후 중앙에 위치하도록 설정
                position: "relative",
                textAlign: "center",
                maxWidth: "90%",
              }}
            >
              {headlines[currentIndex]}
            </Typography>
          </Fade>
        </Box>
      </Box>
    </Paper>
  );
};

export default Alert;
