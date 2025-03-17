import React, { useState, useEffect } from "react";
import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";

// 모듈화된 컴포넌트 임포트
import TimerDisplay from "./timer/TimerDisplay";
import TimerControls from "./timer/TimerControls";
import ResultModal from "./timer/ResultModal";
import ContentModal from "./modal/ContentModal";

// 타이머 결과 처리 임포트
import { TimerResultHandler, StoolAmount } from "./timer/TimerResultHandler";

// 타이머 스토어 임포트
import { useTimerStore } from "../store/timerStore";
import { TIMER_COMPLETED_EVENT } from "../store/timerEvents";

interface TimerProps {
  initialTime?: number; // 초 단위
  noBackground?: boolean; // 배경 제거 옵션
  onTimerStateChange?: (isActive: boolean) => void; // 타이머 상태 변경 알림 콜백
}

const Timer: React.FC<TimerProps> = ({
  initialTime = 8 * 60,
  noBackground = false,
  onTimerStateChange,
}) => {
  const {
    isActive,
    time,
    timerStartTime,
    timerEndTime,
    hasAddedTime,
    isCompleted,
    shouldShowModal,
    setActive,
    setTime,
    setIsCompleted,
    setShouldShowModal,
    resetTimer: resetTimerStore,
    startTimer: startTimerStore,
    pauseTimer: pauseTimerStore,
    addTime: addTimeStore,
  } = useTimerStore();

  const [secondChanged, setSecondChanged] = useState<boolean>(false);
  const [openResultModal, setOpenResultModal] = useState<boolean>(false);
  const [openContentModal, setOpenContentModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // useEffect를 추가하여 컴포넌트 마운트 시 초기화
  useEffect(() => {
    // 초기 마운트 시에만 초기화
    if (!time && !isActive) {
      setTime(initialTime);
    }
  }, []);

  // 시간 변경 감지 및 애니메이션 처리
  useEffect(() => {
    setSecondChanged(true);
    const timer = setTimeout(() => setSecondChanged(false), 500);
    return () => clearTimeout(timer);
  }, [time]);

  // 타이머 시작
  const startTimer = () => {
    startTimerStore();
    onTimerStateChange && onTimerStateChange(true);
  };

  // 타이머 일시정지
  const pauseTimer = () => {
    pauseTimerStore();
    onTimerStateChange && onTimerStateChange(false);
  };

  // 타이머 리셋
  const resetTimer = () => {
    resetTimerStore();
    onTimerStateChange && onTimerStateChange(false);
  };

  // 타이머 상태 변경 시 콜백 호출
  useEffect(() => {
    onTimerStateChange && onTimerStateChange(isActive);
  }, [isActive, onTimerStateChange]);

  // 타이머 완료 이벤트 리스너
  useEffect(() => {
    const handleTimerCompleted = () => {
      setOpenResultModal(true);
    };

    window.addEventListener(TIMER_COMPLETED_EVENT, handleTimerCompleted);

    return () => {
      window.removeEventListener(TIMER_COMPLETED_EVENT, handleTimerCompleted);
    };
  }, []);

  // 결과 모달 상태 감시
  useEffect(() => {
    if (shouldShowModal) {
      setOpenResultModal(true);
    }
  }, [shouldShowModal]);

  // 페이지 가시성 변경 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // 페이지가 다시 보일 때 애니메이션 재설정
        setSecondChanged(true);
        setTimeout(() => setSecondChanged(false), 500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 결과 모달 열기
  const handleOpenResultModal = () => {
    pauseTimerStore(); // 타이머 비활성화
    setOpenResultModal(true); // 결과 모달 열기
    setShouldShowModal(true); // 스토어 상태도 업데이트
  };

  // 결과 모달 닫기 시 shouldShowModal 상태 업데이트
  const handleCloseResultModal = () => {
    setOpenResultModal(false);
    setShouldShowModal(false); // 스토어 상태도 업데이트
  };

  // 콘텐츠 모달 열기
  const handleOpenContentModal = () => {
    setOpenContentModal(true);
  };

  // 결과 저장 후 처리
  const handleSaveResult = async (
    isSuccess: boolean,
    stoolAmount: StoolAmount,
    memo: string
  ) => {
    setIsSaving(true);

    try {
      if (isSuccess) {
        await TimerResultHandler.handleSuccess(
          stoolAmount,
          memo,
          timerStartTime,
          timerEndTime
        );
      } else {
        await TimerResultHandler.handleFail(timerStartTime, timerEndTime);
      }

      // 성공적으로 저장된 후 모달 닫기 및 타이머 리셋
      setOpenResultModal(false);
      setShouldShowModal(false);
      setIsCompleted(false);
      resetTimer();
    } catch (error) {
      console.error("결과 저장 중 오류 발생:", error);
      // 오류 처리 (예: 사용자에게 알림 표시)
    } finally {
      setIsSaving(false);
    }
  };

  // 타이머 컨텐츠 렌더링
  const renderTimerContent = () => (
    <>
      <TimerDisplay
        time={time}
        isActive={isActive}
        secondChanged={secondChanged}
      />

      <TimerControls
        isActive={isActive}
        hasAddedTime={hasAddedTime}
        onStart={startTimer}
        onAddTime={addTimeStore}
        onOpenInfo={handleOpenContentModal}
        onOpenResult={handleOpenResultModal}
      />
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

      {/* 결과 모달 */}
      <ResultModal
        open={openResultModal}
        onClose={handleCloseResultModal}
        onSave={handleSaveResult}
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
