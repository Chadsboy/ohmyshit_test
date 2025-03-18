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
    "건강한 배변을 위해 하루 한 번에서 일주일에 세 번 규칙적인 배변 습관을 유지하세요.",
    "이상적인 배변 시간을 5~10분 이내로 유지하는 것이 좋습니다.",
    "변기에 오래 앉아 있는 습관을 줄여 치질 위험을 예방하세요.",
    "치질은 성인의 75%가 경험하는 질환이므로 예방이 중요합니다.",
    "변비 환자는 평균 배변 시간이 더 길어질 수 있으므로 섬유질 섭취를 늘리세요.",
    "변비 예방을 위해 섬유질이 풍부한 식단을 유지하세요.",
    "천연 완하제인 프룬을 섭취하면 변비 완화에 도움이 됩니다.",
    "물을 하루 1.5L 이상 마셔 원활한 배변을 도와주세요.",
    "아침 식사를 챙겨 장운동을 촉진하세요.",
    "허리를 굽히는 자세를 유지하면 배변 시간이 단축될 수 있습니다.",
    "발판을 사용해 항문 각도를 개선하면 배변이 쉬워집니다.",
    "스트레스 관리는 장 건강을 위해 중요합니다.",
    "운동은 장운동을 자극해 배변 건강을 돕습니다.",
    "미역에 포함된 알긴산이 대변 부피를 늘려 배출을 원활하게 합니다.",
    "잡곡밥과 나물을 섭취해 섬유질을 보충하세요.",
    "임신과 출산 후에는 치질 예방에 신경 쓰세요.",
    "설사가 지속되면 탈수 예방이 중요합니다.",
    "서구화된 식습관은 치질 발병 위험을 높일 수 있습니다.",
    "규칙적인 식사와 운동으로 장 건강을 유지하세요.",
    "화장실에서 스마트폰 사용을 줄여 배변 시간을 단축하세요.",
    "변비가 지속되면 대장암과 같은 질환을 의심하고 전문가 상담을 받으세요.",
    "대변 색깔의 변화는 건강 상태를 반영할 수 있습니다.",
    "검은색 대변은 위장 출혈의 신호일 수 있으니 주의하세요.",
    "혈변이 보이면 즉시 의료 상담을 받으세요!",
    "설사가 지속되면 과민성대장증후군을 의심할 수 있습니다.",
    "과도한 힘주기는 항문 점막을 손상시킬 수 있습니다.",
    "치질 예방을 위해 화장실에서 짧게 머무르세요.",
    "커피는 장운동을 자극해 배변을 촉진할 수 있습니다.",
    "유산균 섭취는 장내 미생물 균형을 유지하는 데 도움이 됩니다.",
    "변비 예방을 위해 섬유질과 물 섭취를 늘리세요.",
    "설탕이 많은 음식은 변비를 악화시킬 수 있습니다.",
    "매운 음식은 치질 증상을 악화시킬 수 있습니다.",
    "노화로 인해 대장의 운동성이 저하될 수 있습니다.",
    "규칙적인 배변 습관 형성이 중요합니다.",
    "아침에 따뜻한 물 한 잔을 마셔 장운동을 활성화하세요.",
    "좌욕은 치질 증상을 완화하는 데 도움이 됩니다.",
    "비만은 치질 발병 위험을 높일 수 있습니다.",
    "과도한 음주는 장 건강에 악영향을 미칠 수 있습니다.",
    "대장의 건강 상태는 피부 건강에도 영향을 줄 수 있습니다.",
    "고지방 음식은 소화 장애와 변비를 유발할 수 있습니다.",
    "설사는 감염성 질환의 신호일 수 있습니다.",
    "치질 환자는 고섬유식과 충분한 물 섭취가 필수적입니다.",
    "변비는 갑상선 기능 저하증과 관련될 수 있습니다.",
    "대변 냄새의 변화는 소화 문제를 나타낼 수 있습니다.",
    "규칙적인 운동은 장운동을 촉진하는 데 효과적입니다.",
    "밤늦게 먹는 음식은 소화 장애를 유발할 가능성이 높습니다.",
    "좌식 생활습관은 변비와 치질 위험을 증가시킬 수 있습니다.",
    "대장의 건강 상태는 면역력에도 영향을 미칩니다.",
    "설사가 지속되면 수분 보충이 필수적입니다.",
    "마늘과 양파는 장내 유익균 증식에 도움이 됩니다.",
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
        py: 1.5,
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
            height: "1.5rem", // 텍스트 높이 고정
            display: "flex",
            justifyContent: "center", // 중앙 정렬
          }}
        >
          <Slide
            direction="left"
            in={slideIn}
            mountOnEnter
            unmountOnExit
            timeout={800}
          >
            <Fade in={visible} timeout={400}>
              <Typography
                ref={textRef}
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  maxWidth: "90%",
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
