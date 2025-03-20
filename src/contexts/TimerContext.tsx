import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { TIMER_COMPLETED_EVENT } from "../store/timerEvents";

// 타이머의 기본 시간(5분 = 300초)
const DEFAULT_TIMER_TIME = 5 * 60;

// 타이머 상태 인터페이스
interface TimerContextType {
  isActive: boolean;
  time: number;
  timerStartTime: number | null;
  timerEndTime: number | null;
  hasAddedTime: boolean;
  isCompleted: boolean;
  shouldShowModal: boolean;
  // 액션
  setActive: (active: boolean) => void;
  setTime: (time: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  addTime: (seconds: number) => void;
  decrementTime: () => void;
  setIsCompleted: (completed: boolean) => void;
  setShouldShowModal: (show: boolean) => void;
}

// 로컬 스토리지 키
const TIMER_STATE_KEY = "timer-context-state-v3";

// Context 생성
const TimerContext = createContext<TimerContextType | undefined>(undefined);

// 컨텍스트 훅
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  // 타이머 상태
  const [isActive, setIsActive] = useState<boolean>(false);
  const [time, setTime] = useState<number>(DEFAULT_TIMER_TIME);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  const [hasAddedTime, setHasAddedTime] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

  // 타이머 인터벌 ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머의 종료 시간을 저장할 ref
  const targetEndTimeRef = useRef<number | null>(null);

  // 초기화 시 불필요한 로컬 스토리지 데이터 제거
  useEffect(() => {
    // 이전 버전의 로컬 스토리지 데이터 삭제
    localStorage.removeItem("timer-context-state");
    localStorage.removeItem("timer-context-state-v2");
    localStorage.removeItem("timer-context-state-v3");
    localStorage.removeItem("timer-storage"); // 이전 zustand 저장소

    console.log("[타이머] 불필요한 로컬 스토리지 데이터 제거됨");
  }, []);

  // 직접 구현한 타이머 시작 함수
  const startTimer = () => {
    console.log("[타이머] 시작함수 호출됨, 현재시간:", time);

    // 이미 실행 중이면 중단
    if (isActive) {
      console.log("[타이머] 이미 실행 중, 무시");
      return;
    }

    // 활성화 상태로 변경
    setIsActive(true);

    // 이전 타이머 제거
    if (timerIntervalRef.current) {
      clearTimeout(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // 시작 시간과 목표 종료 시간 기록 (절대 시간 사용)
    const startTimeMs = Date.now();
    const targetEndTimeMs = startTimeMs + time * 1000;

    // 목표 종료 시간 저장
    targetEndTimeRef.current = targetEndTimeMs;

    // 시작 시간 설정
    if (!timerStartTime) {
      console.log("[타이머] 시작 시간 설정");
      setTimerStartTime(startTimeMs);
    }

    // 타이머 함수
    function runTimer() {
      console.log("[타이머] 타이머 함수 실행됨");

      // 현재 시간과 목표 종료 시간의 차이를 계산
      const currentTimeMs = Date.now();
      const remainingTimeMs = Math.max(0, targetEndTimeMs - currentTimeMs);
      const remainingSeconds = Math.ceil(remainingTimeMs / 1000);

      console.log("[타이머] 남은 시간(초):", remainingSeconds);

      // 시간 업데이트
      setTime(remainingSeconds);

      // 시간이 0이면 타이머 종료
      if (remainingSeconds <= 0) {
        console.log("[타이머] 완료됨");
        setIsActive(false);
        setIsCompleted(true);
        setTimerEndTime(Date.now());
        setShouldShowModal(true);
        targetEndTimeRef.current = null;
        return;
      }

      // 다음 업데이트 시간 계산 (최대 1초, 최소 10ms)
      // 마지막 1초는 더 정확한 타이밍을 위해 더 자주 체크
      const nextUpdateDelay = remainingSeconds <= 1 ? 10 : 100;

      // 다음 타이머 설정
      timerIntervalRef.current = setTimeout(runTimer, nextUpdateDelay);
    }

    // 첫 타이머 설정 (즉시 시작)
    console.log("[타이머] 첫 타이머 설정");
    timerIntervalRef.current = setTimeout(runTimer, 0);
  };

  // 타이머 일시 정지
  const pauseTimer = () => {
    console.log("[타이머] 정지됨");
    setIsActive(false);

    if (timerIntervalRef.current) {
      clearTimeout(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // 타이머 리셋
  const resetTimer = () => {
    console.log("[타이머] 리셋됨");
    setIsActive(false);
    setTime(DEFAULT_TIMER_TIME);
    setTimerStartTime(null);
    setTimerEndTime(null);
    setHasAddedTime(false);
    setIsCompleted(false);
    setShouldShowModal(false);

    if (timerIntervalRef.current) {
      clearTimeout(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // 시간 추가
  const addTime = (seconds: number) => {
    console.log("[타이머] 시간 추가:", seconds);

    if (isActive) {
      // 활성 상태일 때는 현재 타이머를 정지하고
      pauseTimer();

      // 시간을 추가한 후
      setTime((prevTime) => prevTime + seconds);
      setHasAddedTime(true);

      // 타이머를 다시 시작
      setTimeout(() => startTimer(), 0);
    } else {
      // 비활성 상태일 때는 단순히 시간만 추가
      setTime((prevTime) => prevTime + seconds);
      setHasAddedTime(true);
    }
  };

  // 시간 감소 (외부에서 직접 호출용)
  const decrementTime = () => {
    setTime((prevTime) => Math.max(0, prevTime - 1));
  };

  // 페이지 가시성 변경 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[타이머] 페이지 다시 표시됨");
        // 타이머가 활성 상태이고 목표 종료 시간이 있을 때만 실행
        if (isActive && targetEndTimeRef.current !== null) {
          // 타이머 멈추지 않고 현재 남은 시간 업데이트
          const currentTimeMs = Date.now();
          const remainingTimeMs = Math.max(
            0,
            targetEndTimeRef.current - currentTimeMs
          );
          const remainingSeconds = Math.ceil(remainingTimeMs / 1000);

          console.log(
            "[타이머] 페이지 복귀 후 남은 시간(초):",
            remainingSeconds
          );

          // 기존 타이머 정리
          if (timerIntervalRef.current) {
            clearTimeout(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }

          // 남은 시간이 0이면 타이머 완료 처리
          if (remainingSeconds <= 0) {
            setTime(0);
            setIsActive(false);
            setIsCompleted(true);
            setTimerEndTime(Date.now());
            setShouldShowModal(true);
            targetEndTimeRef.current = null;
          } else {
            // 남은 시간 업데이트 후 타이머 재시작
            setTime(remainingSeconds);

            // 타이머 재시작 함수 (내부에서 기능 정의하여 클로저 활용)
            const restartTimer = () => {
              // 타이머 활성화
              setIsActive(true);

              // 타이머 함수 재정의
              function runTimer() {
                const currentTime = Date.now();
                const remaining = Math.max(
                  0,
                  targetEndTimeRef.current! - currentTime
                );
                const remainingSecs = Math.ceil(remaining / 1000);

                console.log("[타이머] 재시작 후 남은 시간(초):", remainingSecs);

                // 시간 업데이트
                setTime(remainingSecs);

                // 타이머 완료 체크
                if (remainingSecs <= 0) {
                  setIsActive(false);
                  setIsCompleted(true);
                  setTimerEndTime(Date.now());
                  setShouldShowModal(true);
                  targetEndTimeRef.current = null;
                  return;
                }

                // 다음 업데이트 예약
                const delay = remainingSecs <= 1 ? 10 : 100;
                timerIntervalRef.current = setTimeout(runTimer, delay);
              }

              // 즉시 타이머 시작
              timerIntervalRef.current = setTimeout(runTimer, 0);
            };

            // 타이머 재시작
            restartTimer();
          }
        }
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // 이벤트 리스너 제거
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive]);

  // 브라우저 종료 시 정리
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearTimeout(timerIntervalRef.current);
      }
    };
  }, []);

  // 컨텍스트 값
  const value: TimerContextType = {
    isActive,
    time,
    timerStartTime,
    timerEndTime,
    hasAddedTime,
    isCompleted,
    shouldShowModal,
    setActive: setIsActive,
    setTime,
    startTimer,
    pauseTimer,
    resetTimer,
    addTime,
    decrementTime,
    setIsCompleted,
    setShouldShowModal,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export default TimerContext;
