import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper, useTheme, Fade, Slide } from "@mui/material";
import { NewReleases } from "@mui/icons-material";

interface AlertProps {
  isTimerActive?: boolean; // 타이머 활성화 여부
}

const Alert: React.FC<AlertProps> = ({ isTimerActive = false }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [slideIn, setSlideIn] = useState(true);
  const textRef = useRef<HTMLElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  // 개발 환경 로그 (디버깅용)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Alert 컴포넌트 isTimerActive:", isTimerActive);
    }

    // boolean 값으로 명시적 변환 후 상태 저장
    setShouldRender(Boolean(isTimerActive));
  }, [isTimerActive]);

  // 뉴스 헤드라인 목록
  const headlines = [
    "규칙적인 배변 습관을 유지하세요.",
    "배변 시간은 5~10분이 적절합니다.",
    "변기에 오래 앉지 마세요.",
    "치질 예방을 위해 주의하세요.",
    "변비 예방을 위해 섬유질을 섭취하세요.",
    "프룬은 변비 완화에 도움됩니다.",
    "물을 충분히 마셔 배변을 원활하게 하세요.",
    "아침 식사는 장운동을 촉진합니다.",
    "허리를 굽히면 배변이 쉬워집니다.",
    "발판을 사용하면 배변이 원활해집니다.",
    "스트레스 관리가 장 건강에 중요합니다.",
    "운동은 장운동을 촉진합니다.",
    "미역은 배변을 돕는 알긴산을 포함합니다.",
    "잡곡밥과 나물은 장 건강에 좋습니다.",
    "임신과 출산 후 치질에 유의하세요.",
    "설사 시 탈수 예방이 필요합니다.",
    "서구화된 식습관은 치질 위험을 높입니다.",
    "규칙적인 식사와 운동이 중요합니다.",
    "화장실에서 스마트폰 사용을 줄이세요.",
    "변비가 지속되면 검진을 받으세요.",
    "대변 색이 건강 상태를 나타냅니다.",
    "검은 변은 출혈 가능성을 의미합니다.",
    "혈변이 보이면 병원을 방문하세요!",
    "설사가 지속되면 장 건강을 점검하세요.",
    "힘주기는 항문을 손상시킬 수 있습니다.",
    "화장실에서 오래 머물지 마세요.",
    "커피는 배변을 촉진할 수 있습니다.",
    "유산균은 장내 균형을 유지해줍니다.",
    "변비 예방을 위해 물을 충분히 드세요.",
    "설탕이 많은 음식은 변비를 악화시킵니다.",
    "매운 음식은 치질에 좋지 않습니다.",
    "노화로 장운동이 저하될 수 있습니다.",
    "규칙적인 배변 습관을 만드세요.",
    "따뜻한 물이 장운동을 도와줍니다.",
    "좌욕은 치질 완화에 도움됩니다.",
    "비만은 치질 위험을 높입니다.",
    "과음은 장 건강에 해롭습니다.",
    "대장은 피부 건강과도 관련됩니다.",
    "고지방 음식은 변비를 유발할 수 있습니다.",
    "설사는 감염의 신호일 수 있습니다.",
    "치질 예방을 위해 섬유질을 섭취하세요.",
    "변비는 갑상선 기능 저하와 관련될 수 있습니다.",
    "대변 냄새 변화는 소화 이상 신호입니다.",
    "운동은 장운동 촉진에 효과적입니다.",
    "밤늦은 식사는 소화를 방해할 수 있습니다.",
    "좌식 생활은 변비와 치질을 유발할 수 있습니다.",
    "대장 건강은 면역력과 관련됩니다.",
    "설사 시 충분한 수분을 섭취하세요.",
    "마늘과 양파는 장내 유익균을 증식시킵니다.",
  ];

  // 문구 변경 및 애니메이션 처리
  useEffect(() => {
    if (!shouldRender) return;

    let timeoutId: NodeJS.Timeout;

    const changeHeadline = () => {
      // 현재 문구 페이드 아웃 및 슬라이드 애웃
      setVisible(false);
      setSlideIn(false);

      // 텍스트가 사라진 후 새 문구로 교체
      timeoutId = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % headlines.length);
        setVisible(true);
        setSlideIn(true);

        // 다음 문구 변경 예약 (5초 후)
        timeoutId = setTimeout(() => {
          changeHeadline();
        }, 5000);
      }, 500);
    };

    // 최초 실행 - 5초 후 변경 시작
    timeoutId = setTimeout(() => {
      changeHeadline();
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [headlines.length, shouldRender]);

  // 타이머가 비활성화되면 Alert도 숨김
  if (!shouldRender) {
    return null;
  }

  return (
    <Paper
      elevation={5}
      sx={{
        width: "100%",
        py: { xs: 1, sm: 1.5 },
        overflow: "hidden",
        borderRadius: 0,
        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}30, ${theme.palette.primary.main}20, ${theme.palette.primary.light}30)`,
        backgroundSize: "200% 200%",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
        mx: 0,
        px: 0,
        display: shouldRender ? "block" : "none", // 타이머 활성화 시에만 표시
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
            height: "auto", // 높이를 자동으로 조정
            minHeight: "1.5rem", // 최소 높이 설정
            display: "flex",
            justifyContent: "center", // 중앙 정렬
            py: 0.5, // 위아래 여백 추가
          }}
        >
          <Slide
            direction="left"
            in={slideIn}
            mountOnEnter
            unmountOnExit
            timeout={800}
            style={{ width: "100%" }}
          >
            <Fade in={visible} timeout={400}>
              <Typography
                ref={textRef}
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" }, // 텍스트 크기 약간 줄임
                  whiteSpace: "normal", // 자동 줄바꿈 적용
                  textAlign: "center",
                  maxWidth: "90%",
                  lineHeight: 1.3, // 줄 간격 조정
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2, // 최대 2줄까지 표시
                  WebkitBoxOrient: "vertical",
                }}
              >
                {headlines[currentIndex]}
              </Typography>
            </Fade>
          </Slide>
        </Box>
      </Box>
    </Paper>
  );
};

export default Alert;
