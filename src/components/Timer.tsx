import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
  keyframes,
  Zoom,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Collapse,
  Divider,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  RestartAlt,
  CheckCircle,
  Cancel,
  Timer as TimerIcon,
  SaveAlt,
  Add,
  Block,
  MenuBook,
} from "@mui/icons-material";

// 모달 컴포넌트 임포트
import ResultModal from "./modal/ResultModal";
import ContentModal from "./modal/ContentModal";

// store 임포트
import { useTimerStore } from "../store/timerStore";

// 숫자가 바뀔 때 페이드 애니메이션
const fadeInOut = keyframes`
  0% { opacity: 0.7; transform: scale(1.02); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

// 타이머 활성화 시 맥동 애니메이션
const pulsate = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

import { createBowelRecord } from "../services/bowelRecords";
import { getCurrentUser } from "../services/auth";

interface TimerProps {
  initialTime?: number; // 초 단위
  noBackground?: boolean; // 배경 제거 옵션
  onTimerStateChange?: (isActive: boolean) => void; // 타이머 상태 변경 알림 콜백
}

// 배변량 타입
type StoolAmount = "많음" | "보통" | "적음" | "이상" | "";

const Timer: React.FC<TimerProps> = ({
  initialTime = 25 * 60,
  noBackground = false,
  onTimerStateChange,
}) => {
  const {
    isActive,
    time,
    timerStartTime,
    timerEndTime,
    hasAddedTime,
    setActive,
    setTime,
    setTimerStartTime,
    setTimerEndTime,
    setHasAddedTime,
    resetTimer: resetTimerStore,
  } = useTimerStore();

  const [secondChanged, setSecondChanged] = useState<boolean>(false);
  const [openResultModal, setOpenResultModal] = useState<boolean>(false);
  const [openContentModal, setOpenContentModal] = useState<boolean>(false);
  const [showSuccessDetails, setShowSuccessDetails] = useState<boolean>(false);
  const [stoolAmount, setStoolAmount] = useState<StoolAmount>("");
  const [memo, setMemo] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 타이머 로직
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time - 1);
        setSecondChanged(true);
        setTimeout(() => setSecondChanged(false), 500);
      }, 1000);
    } else if (time === 0) {
      setActive(false);
      if (onTimerStateChange) onTimerStateChange(false);
      setOpenResultModal(true);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, onTimerStateChange, setActive, setTime]);

  // 타이머 시작
  const startTimer = () => {
    setActive(true);
    setTimerStartTime(new Date());
    onTimerStateChange && onTimerStateChange(true);
  };

  // 시간 추가 (1분)
  const addTime = () => {
    if (!hasAddedTime) {
      setTime((prevTime) => prevTime + 60); // 1분(60초) 추가
      setHasAddedTime(true); // 한 번만 추가할 수 있도록 설정
      // 추가 시간 상태를 재설정하는 타임아웃 설정하지 않음 (한 번만 사용 가능)
    }
  };

  // 타이머 일시정지
  const pauseTimer = () => {
    setActive(false);
    setTimerEndTime(new Date());
    onTimerStateChange && onTimerStateChange(false);
  };

  // 타이머 리셋
  const resetTimer = () => {
    setActive(false);
    setTime(initialTime);
    setTimerStartTime(null);
    setTimerEndTime(null);
    setHasAddedTime(false);
    onTimerStateChange && onTimerStateChange(false);
  };

  // 결과 모달 열기
  const handleOpenResultModal = () => {
    setActive(false); // 타이머 비활성화
    setTimerEndTime(new Date()); // 종료 시간 기록
    onTimerStateChange && onTimerStateChange(false); // Alert 숨기기
    setOpenResultModal(true);
  };

  // 콘텐츠 모달 열기
  const handleOpenContentModal = () => {
    setOpenContentModal(true);
  };

  // 성공 처리
  const handleSuccess = async (stoolAmount: StoolAmount, memo: string) => {
    if (!timerStartTime) {
      console.error("타이머 시작 시간이 없습니다.");
      resetTimer();
      setOpenResultModal(false);
      return;
    }

    const endTime = timerEndTime || new Date();
    const durationInMinutes = Math.round(
      (endTime.getTime() - timerStartTime.getTime()) / (1000 * 60)
    );

    setIsSaving(true);

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("사용자 인증 정보를 찾을 수 없습니다.");
      }

      const recordData = {
        user_id: currentUser.id,
        start_time: timerStartTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationInMinutes,
        success: true,
        amount: stoolAmount || null,
        memo: memo || null,
      };

      const { data, error } = await createBowelRecord(recordData);

      if (error) {
        console.error("배변 기록 저장 중 오류:", error);
        alert("배변 기록 저장에 실패했습니다. 다시 시도해주세요.");
      } else {
        console.log("배변 기록이 성공적으로 저장되었습니다:", data);
      }
    } catch (err) {
      console.error("배변 기록 저장 중 예외 발생:", err);
    } finally {
      setIsSaving(false);
      resetTimer();
      setOpenResultModal(false);
    }
  };

  // 실패 처리
  const handleFail = async () => {
    if (!timerStartTime) {
      console.error("타이머 시작 시간이 없습니다.");
      resetTimer();
      setOpenResultModal(false);
      return;
    }

    // 종료 시간이 없는 경우, 현재 시간으로 설정
    const endTime = timerEndTime || new Date();

    // 시간 차이 계산 (분 단위)
    const durationInMinutes = Math.round(
      (endTime.getTime() - timerStartTime.getTime()) / (1000 * 60)
    );

    setIsSaving(true);

    try {
      // 현재 인증된 사용자 정보 가져오기
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        throw new Error("사용자 인증 정보를 찾을 수 없습니다.");
      }

      // 실패한 배변 기록 저장
      const recordData = {
        user_id: currentUser.id, // 현재 사용자 ID 설정
        start_time: timerStartTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationInMinutes,
        success: false,
        amount: null,
        memo: "실패", // 필요에 따라 수정
      };

      const { data, error } = await createBowelRecord(recordData);

      if (error) {
        console.error("배변 기록(실패) 저장 중 오류:", error);
        alert("배변 기록 저장에 실패했습니다. 다시 시도해주세요.");
      } else {
        console.log("배변 기록(실패)이 성공적으로 저장되었습니다:", data);
      }
    } catch (err) {
      console.error("배변 기록(실패) 저장 중 예외 발생:", err);
    } finally {
      setIsSaving(false);
      resetTimer();
      setOpenResultModal(false);
    }
  };

  // 시간 표시 형식 변환 (MM:SS)
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // 타이머 내용을 렌더링하는 함수
  const renderTimerContent = () => (
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

      <Stack
        direction="row"
        spacing={{ xs: 1.5, sm: 2.5 }}
        justifyContent="center"
        sx={{
          mt: 2,
          perspective: "1000px",
        }}
      >
        <Zoom in={true} style={{ transitionDelay: "100ms" }}>
          {!isActive ? (
            <Tooltip title="시작" arrow placement="top">
              <IconButton
                aria-label="시작"
                color="warning"
                onClick={startTimer}
                size="large"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.warning.light}40 0%, ${theme.palette.warning.main}20 100%)`,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
                  p: { xs: 1.75, sm: 2 },
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                    background: `linear-gradient(135deg, ${theme.palette.warning.light}50 0%, ${theme.palette.warning.main}30 100%)`,
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <PlayArrow
                  fontSize="large"
                  sx={{
                    filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
                  }}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip
              title={hasAddedTime ? "이미 추가되었습니다" : "1분 추가"}
              arrow
              placement="top"
            >
              <span>
                <IconButton
                  aria-label={hasAddedTime ? "비활성화됨" : "1분 추가"}
                  color="warning"
                  onClick={addTime}
                  disabled={hasAddedTime}
                  size="large"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.warning.light}40 0%, ${theme.palette.warning.main}20 100%)`,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
                    p: { xs: 1.75, sm: 2 },
                    transition: "all 0.2s ease",
                    opacity: hasAddedTime ? 0.7 : 1,
                    "&:hover": {
                      transform: hasAddedTime ? "none" : "translateY(-2px)",
                      boxShadow: hasAddedTime
                        ? "0px 4px 10px rgba(0, 0, 0, 0.12)"
                        : "0px 6px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  {hasAddedTime ? (
                    <Block
                      fontSize="large"
                      sx={{
                        filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
                      }}
                    />
                  ) : (
                    <Add
                      fontSize="large"
                      sx={{
                        filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
                      }}
                    />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Zoom>

        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <Tooltip title="정보 보기" arrow placement="top">
            <IconButton
              aria-label="정보 보기"
              color="info"
              onClick={handleOpenContentModal}
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.info.light}30 0%, ${theme.palette.info.main}10 100%)`,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
                p: { xs: 1.75, sm: 2 },
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <MenuBook
                fontSize="large"
                sx={{
                  filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
                }}
              />
            </IconButton>
          </Tooltip>
        </Zoom>

        <Zoom in={true} style={{ transitionDelay: "300ms" }}>
          <Tooltip title="결과 입력" arrow placement="top">
            <IconButton
              aria-label="결과 입력"
              color="success"
              onClick={handleOpenResultModal}
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.light}30 0%, ${theme.palette.success.main}10 100%)`,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
                p: { xs: 1.75, sm: 2 },
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CheckCircle
                fontSize="large"
                sx={{
                  filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
                }}
              />
            </IconButton>
          </Tooltip>
        </Zoom>
      </Stack>
    </>
  );

  return (
    <>
      {noBackground ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            px: 2,
            py: 1,
          }}
        >
          {renderTimerContent()}
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            mt: 4,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
                : `linear-gradient(145deg, #ffffff, #f5f5f5)`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0px 8px 25px rgba(0, 0, 0, 0.3)"
                : "0px 8px 25px rgba(0, 0, 0, 0.1)",
          }}
        >
          {renderTimerContent()}
        </Paper>
      )}

      {/* 결과 입력 모달 */}
      <ResultModal
        open={openResultModal}
        onClose={() => setOpenResultModal(false)}
        onSuccess={handleSuccess}
        onFail={handleFail}
        isSaving={isSaving}
      />

      {/* 콘텐츠 모달 */}
      <ContentModal
        open={openContentModal}
        onClose={() => setOpenContentModal(false)}
      />
    </>
  );
};

export default Timer;
