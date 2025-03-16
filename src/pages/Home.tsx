import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Timer from "../components/Timer";
import Alert from "../components/Alert";

const Home = () => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleTimerStateChange = (active: boolean) => {
    setIsTimerActive(active);
  };

  // 화면 크기에 따라 Alert 위치 조정
  const getAlertPosition = () => {
    if (isSmallScreen) {
      return "50px";
    } else if (isMediumScreen) {
      return "55px";
    } else {
      return "60px";
    }
  };

  return (
    <>
      <Container maxWidth="xs" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: 2,
            minHeight: "calc(100vh - 120px)", // 알림 영역을 위한 공간 확보
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            홈페이지 입니다
          </Typography>

          {/* 이미지 영역 */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "250px", sm: "300px" },
              height: "auto",
              mb: 3,
            }}
          >
            <img
              src="./src/assets/home.png"
              alt="홈페이지 이미지"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* 타이머 컴포넌트 */}
          <Timer
            initialTime={15 * 60}
            noBackground
            onTimerStateChange={handleTimerStateChange}
          />
        </Box>
      </Container>

      {/* 알림 컴포넌트 - 푸터 위 띠 형식 */}
      <Box
        sx={{
          position: "fixed",
          bottom: getAlertPosition(),
          left: 0,
          right: 0,
          zIndex: 9999,
          px: 0, // 패딩 제거
          mx: 0, // 마진 제거
          width: "100%",
          // 안전 영역 대응
          paddingBottom: { xs: "env(safe-area-inset-bottom, 0px)", sm: 0 },
        }}
      >
        <Alert isTimerActive={isTimerActive} />
      </Box>
    </>
  );
};

export default Home;
