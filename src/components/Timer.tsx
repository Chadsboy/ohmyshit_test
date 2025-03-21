import React, { useState, useEffect } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Global, css } from "@emotion/react";

// 모듈화된 컴포넌트 임포트
import TimerDisplay from "./timer/TimerDisplay";
import TimerControls from "./timer/TimerControls";
import ResultModal from "./modal/ResultModal";
import ContentModal from "./modal/ContentModal";

// 타이머 스토어 임포트
// import { useTimerStore } from "../store/timerStore";
import { useTimer } from "../contexts/TimerContext";
import { TimerResultHandler, StoolAmount } from "./timer/TimerResultHandler";

// 숫자가 바뀔 때 페이드 애니메이션 - !중요: 배포 환경에서도 동일하게 적용되도록 수정
const numberFadeInOut = css`
  @keyframes fadeInOut {
    0% {
      opacity: 0.7;
      transform: scale(1.02);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// 타이머 디스플레이에서 사용하는 페이드 애니메이션 (TimerDisplay.tsx와 일치시킴)
const displayFadeInOut = css`
  @keyframes fadeInOut {
    0% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.7;
    }
  }
`;

// 타이머 활성화 시 맥동 애니메이션 - !중요: 배포 환경에서도 동일하게 적용되도록 수정
const pulsate = css`
  @keyframes pulsate {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
    }
  }
`;

/**
 * 타이머 컴포넌트
 * 배변 활동을 위한 타이머입니다.
 */
const Timer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 타이머 상태 관리
  const {
    isActive,
    time,
    hasAddedTime,
    resetTimer,
    startTimer,
    pauseTimer,
    addTime,
    shouldShowModal,
    setShouldShowModal,
    timerStartTime,
    timerEndTime,
    isCompleted,
  } = useTimer();

  // 초 변경 감지
  const [secondChanged, setSecondChanged] = useState(false);
  const [openContentModal, setOpenContentModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 개발 환경 로그 (디버깅용)
  useEffect(() => {
    console.log("Timer 컴포넌트 렌더링됨, isActive:", isActive, "time:", time);
  }, [isActive, time]);

  // 초 변경 효과 처리
  useEffect(() => {
    setSecondChanged(true);
    const timer = setTimeout(() => {
      setSecondChanged(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [time]);

  // 타이머 내용 모달 열기
  const handleOpenContentModal = () => {
    setOpenContentModal(true);
  };

  // 결과 모달 열기
  const handleOpenResultModal = () => {
    console.log("결과 모달 열기");
    pauseTimer();
    setShouldShowModal(true);
  };

  // 결과 모달 닫기
  const handleCloseResultModal = () => {
    console.log("결과 모달 닫기");
    setShouldShowModal(false);

    // 모달이 닫힐 때 타이머 다시 시작
    if (time > 0 && !isCompleted) {
      console.log("모달이 닫힐 때 타이머 다시 시작");
      startTimer();
    }
  };

  // 배변 결과 성공 저장 처리
  const handleSuccess = async (amount: StoolAmount, memo: string) => {
    try {
      console.log("배변 결과 성공 저장 시작", amount, memo);
      setIsSaving(true);

      // TimerResultHandler를 사용하여 성공 기록 저장
      await TimerResultHandler.handleSuccess(
        amount,
        memo,
        new Date(timerStartTime ?? Date.now()),
        timerEndTime ? new Date(timerEndTime) : new Date()
      );

      // 모달 닫기
      setShouldShowModal(false);

      // 타이머 리셋
      resetTimer();
      console.log("배변 결과 성공 저장 완료");
    } catch (error) {
      console.error("배변 결과 저장 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 배변 결과 실패 저장 처리
  const handleFail = async () => {
    try {
      console.log("배변 결과 실패 저장 시작");
      setIsSaving(true);

      // TimerResultHandler를 사용하여 실패 기록 저장
      await TimerResultHandler.handleFail(
        new Date(timerStartTime ?? Date.now()),
        timerEndTime ? new Date(timerEndTime) : new Date()
      );

      // 모달 닫기
      setShouldShowModal(false);

      // 타이머 리셋
      resetTimer();
      console.log("배변 결과 실패 저장 완료");
    } catch (error) {
      console.error("배변 결과 저장 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 시작 버튼 클릭 로직
  const handleStartTimer = () => {
    console.log("시작 버튼 클릭됨, 현재 상태:", { isActive, time });
    // 타이머 시작 상태 강제 설정
    if (!isActive) {
      startTimer();
      // 타이머 상태 확인을 위한 체크
      setTimeout(() => {
        console.log("타이머 시작 후 상태 확인:", { isActive, time });
      }, 1500);
    }
  };

  // 타이머 시간 추가
  const handleAddTime = () => {
    console.log("시간 추가 버튼 클릭됨, 현재 시간:", time);
    addTime(180); // 3분 = 180초 추가
    console.log("시간 추가 후:", time + 180);
  };

  // 타이머 상태 확인
  useEffect(() => {
    const checkTimer = setInterval(() => {
      if (isActive) {
        console.log("타이머 상태 확인 - isActive:", isActive, "time:", time);
      }
    }, 3000);

    return () => clearInterval(checkTimer);
  }, [isActive, time]);

  return (
    <>
      {/* 전역 스타일 주입 - 배포 환경에서도 적용되도록 */}
      <Global styles={[numberFadeInOut, displayFadeInOut, pulsate]} />

      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          mx: "auto",
          textAlign: "center",
          animation: "none",
        }}
      >
        {/* 타이머 표시 부분 */}
        <TimerDisplay
          time={time}
          isActive={isActive}
          secondChanged={secondChanged}
        />

        {/* 타이머 컨트롤 버튼들 */}
        <TimerControls
          isActive={isActive}
          hasAddedTime={hasAddedTime}
          onStart={handleStartTimer}
          onAddTime={handleAddTime}
          onOpenContent={handleOpenContentModal}
          onOpenResult={handleOpenResultModal}
        />

        {/* 결과 입력 모달 - 단계별 모달로 변경 */}
        <ResultModal
          open={shouldShowModal}
          onClose={handleCloseResultModal}
          onSuccess={handleSuccess}
          onFail={handleFail}
          isSaving={isSaving}
        />

        {/* 콘텐츠 모달 */}
        <ContentModal
          open={openContentModal}
          onClose={() => setOpenContentModal(false)}
        />
      </Box>
    </>
  );
};

export default Timer;
