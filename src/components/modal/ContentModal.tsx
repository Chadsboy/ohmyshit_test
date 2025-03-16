import React, { useState } from "react";
import {
  Modal,
  Paper,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Zoom,
  Divider,
  IconButton,
} from "@mui/material";
import { Close, NavigateBefore, NavigateNext } from "@mui/icons-material";

interface ContentModalProps {
  open: boolean;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 콘텐츠 목록
  const contents = [
    {
      title: "건강한 배변 습관",
      content:
        "규칙적인 배변은 장 건강의 중요한 지표입니다. 하루에 물 8잔 이상 마시고, 충분한 식이섬유를 섭취하세요. 전문가들은 하루 25-30g의 식이섬유를 권장합니다. 일정한 시간에 배변하는 습관을 들이고, 변의를 느낄 때 참지 않는 것이 좋습니다. 장시간 앉아 있는 경우 주기적으로 일어나서 움직이는 것도 도움이 됩니다.",
    },
    {
      title: "식이섬유가 풍부한 음식",
      content:
        "브로콜리, 사과, 귀리, 콩류는 장 건강에 좋은 식이섬유가 풍부합니다. 이러한 음식을 매일 조금씩 섭취하면 배변 활동이 원활해집니다. 특히 수용성 식이섬유는 대장에서 좋은 박테리아의 먹이가 되어 장 건강을 증진시킵니다. 전곡류, 견과류, 씨앗류, 과일 및 채소를 다양하게 섭취하는 것이 좋습니다.",
    },
    {
      title: "장 건강과 운동",
      content:
        "규칙적인 운동은 장의 연동 운동을 촉진합니다. 하루 30분의 걷기만으로도 소화기관의 활동이 증가하고 변비를 예방할 수 있습니다. 복부 근육을 강화하는 운동도 배변에 도움이 됩니다. 요가의 특정 포즈나 복부 마사지는 장 기능을 활성화하는 데 효과적입니다. 가벼운 조깅이나 수영도 좋은 선택입니다.",
    },
    {
      title: "스트레스와 장 건강",
      content:
        "스트레스는 장 기능에 직접적인 영향을 미칩니다. 명상, 심호흡, 충분한 수면으로 스트레스를 관리하면 장 건강에도 도움이 됩니다. 장과 뇌는 '장-뇌 축'이라는 신경계를 통해 긴밀하게 연결되어 있어, 정신적 스트레스가 장 기능에 영향을 주고 반대로 장 건강이 정신 건강에 영향을 줄 수 있습니다. 스트레스 관리는 전반적인 건강과 함께 장 건강을 위해서도 중요합니다.",
    },
    {
      title: "프로바이오틱스와 장 건강",
      content:
        "프로바이오틱스는 장내 유익균을 증가시켜 소화를 돕고 면역 기능을 강화합니다. 요구르트, 김치, 콤부차 등의 발효식품에 풍부하게 들어있습니다. 특히 항생제 복용 후에는 장내 균총이 교란될 수 있어 프로바이오틱스 섭취가 중요합니다. 프리바이오틱스는 유익균의 먹이가 되는 물질로, 마늘, 양파, 바나나, 아스파라거스 등에 풍부합니다.",
    },
    {
      title: "수분 섭취와 배변 건강",
      content:
        "충분한 수분 섭취는 변을 부드럽게 만들어 배변을 용이하게 합니다. 매일 최소 1.5~2리터의 물을 마시는 것이 좋습니다. 카페인이나 알코올은 탈수를 유발할 수 있으므로 제한하는 것이 좋습니다. 물 외에도 수분이 많은 과일과 채소를 섭취하는 것도 도움이 됩니다. 특히 아침에 일어나서 공복에 물 한 잔을 마시면 장 운동을 촉진하는 데 효과적입니다.",
    },
  ];

  // 현재 표시 중인 콘텐츠 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이전 콘텐츠로 이동
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? contents.length - 1 : prevIndex - 1
    );
  };

  // 다음 콘텐츠로 이동
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % contents.length);
  };

  // 현재 콘텐츠 정보
  const currentContent = contents[currentIndex];

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Zoom in={open}>
        <Paper
          sx={{
            position: "relative",
            width: isMobile ? "90%" : 450,
            maxWidth: "90%",
            height: isMobile ? "auto" : 520, // 모달 높이 고정
            maxHeight: isMobile ? "80vh" : 520, // 모바일에서는 화면 높이에 비례
            p: 4,
            borderRadius: 3,
            outline: "none",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0px 10px 40px rgba(0, 0, 0, 0.4)"
                : "0px 10px 40px rgba(0, 0, 0, 0.2)",
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
                : `linear-gradient(145deg, #ffffff, #f8f8f8)`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 제목 */}
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            textAlign="center"
            sx={{
              fontWeight: "bold",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            알아두면 좋은 정보
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* 콘텐츠 컨테이너 (스크롤 가능) */}
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              pr: 1,
              mb: 3,
              // 스크롤바 숨김 (브라우저마다 다른 방식으로 작동)
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.2)",
              },
              scrollbarWidth: "thin",
              scrollbarColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1) transparent"
                  : "rgba(0, 0, 0, 0.1) transparent",
            }}
          >
            {/* 콘텐츠 제목 */}
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              {currentContent.title}
            </Typography>

            {/* 콘텐츠 내용 */}
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                lineHeight: 1.7,
                color: theme.palette.text.secondary,
              }}
            >
              {currentContent.content}
            </Typography>
          </Box>

          {/* 네비게이션 및 버튼 영역 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* 이전 버튼 */}
            <IconButton
              onClick={handlePrevious}
              color="primary"
              size="large"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(25, 118, 210, 0.1)"
                    : "rgba(25, 118, 210, 0.05)",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.2)"
                      : "rgba(25, 118, 210, 0.1)",
                },
              }}
            >
              <NavigateBefore />
            </IconButton>

            {/* 닫기 버튼 */}
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              sx={{
                py: 0.8,
                px: 3,
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.4)",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0px 6px 15px rgba(25, 118, 210, 0.5)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              닫기
            </Button>

            {/* 다음 버튼 */}
            <IconButton
              onClick={handleNext}
              color="primary"
              size="large"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(25, 118, 210, 0.1)"
                    : "rgba(25, 118, 210, 0.05)",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.2)"
                      : "rgba(25, 118, 210, 0.1)",
                },
              }}
            >
              <NavigateNext />
            </IconButton>
          </Box>
        </Paper>
      </Zoom>
    </Modal>
  );
};

export default ContentModal;
