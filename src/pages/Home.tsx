import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Timer from "../components/Timer";
import Alert from "../components/Alert";
import homeImage from "../assets/home.png";
import { useTimerStore } from "../store/timerStore";

const Home = () => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // 타이머 스토어에서 상태 가져오기
  const { isActive } = useTimerStore();

  // 타이머 상태가 변경될 때마다 로컬 상태 업데이트
  useEffect(() => {
    // 명시적으로 Boolean으로 변환하여 일관된 값을 보장
    setIsTimerActive(Boolean(isActive));

    // 디버깅용 콘솔 로그 (개발 모드에서만 출력)
    if (process.env.NODE_ENV === "development") {
      console.log("타이머 활성화 상태:", Boolean(isActive));
    }
  }, [isActive]);

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
          {/* 이미지 영역 */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "300px", sm: "400px" },
              height: "auto",
              mb: 3,
            }}
          >
            <img
              src={homeImage}
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
          <Timer />
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
        {/* isTimerActive 상태가 항상 불리언 값이 되도록 명시적 변환 */}
        <Alert isTimerActive={Boolean(isTimerActive)} />
      </Box>
    </>
  );
};

export default Home;
