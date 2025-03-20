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
const TIMER_STATE_KEY = "timer-context-state";

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
  const lastSavedTimeRef = useRef<number>(Date.now());

  // 타이머 상태를 로컬 스토리지에 저장
  const saveTimerState = useCallback(() => {
    const stateToSave = {
      isActive,
      time,
      timerStartTime,
      timerEndTime,
      hasAddedTime,
      isCompleted,
      shouldShowModal,
      lastSavedAt: Date.now(),
    };

    try {
      localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(stateToSave));
      console.log("[TimerContext] 타이머 상태 저장됨:", stateToSave);
    } catch (error) {
      console.error("[TimerContext] 타이머 상태 저장 중 오류 발생:", error);
    }
  }, [
    isActive,
    time,
    timerStartTime,
    timerEndTime,
    hasAddedTime,
    isCompleted,
    shouldShowModal,
  ]);

  // 타이머 시작
  const startTimer = useCallback(() => {
    if (isActive) return;

    setIsActive(true);

    if (!timerStartTime) {
      setTimerStartTime(Date.now());
    }

    // 이전 인터벌 정리
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // 새 인터벌 설정 (웹 워커 대신 고정밀 타이머 사용)
    const startTime = Date.now();
    const initialTime = time;

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newTime = Math.max(0, initialTime - elapsed);

      setTime(newTime);

      if (newTime === 0) {
        // 타이머 완료
        setIsActive(false);
        setIsCompleted(true);
        setTimerEndTime(Date.now());
        setShouldShowModal(true);

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }

        // 타이머 완료 이벤트 발송
        window.dispatchEvent(new CustomEvent(TIMER_COMPLETED_EVENT));
      }
    }, 100); // 100ms 간격으로 업데이트하여 더 정확한 타이머 구현

    // 상태 저장
    saveTimerState();
  }, [isActive, time, timerStartTime, saveTimerState]);

  // 타이머 일시 정지
  const pauseTimer = useCallback(() => {
    setIsActive(false);

    // 인터벌 정리
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // 상태 저장
    saveTimerState();
  }, [saveTimerState]);

  // 타이머 리셋
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTime(DEFAULT_TIMER_TIME);
    setTimerStartTime(null);
    setTimerEndTime(null);
    setHasAddedTime(false);
    setIsCompleted(false);
    setShouldShowModal(false);

    // 인터벌 정리
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // 상태 저장
    saveTimerState();
  }, [saveTimerState]);

  // 시간 추가
  const addTime = useCallback(
    (seconds: number) => {
      setTime((prevTime) => prevTime + seconds);
      setHasAddedTime(true);
      saveTimerState();
    },
    [saveTimerState]
  );

  // 시간 감소
  const decrementTime = useCallback(() => {
    setTime((prevTime) => {
      if (prevTime <= 0) return prevTime;

      const newTime = prevTime - 1;

      if (newTime === 0) {
        // 타이머 완료
        setIsActive(false);
        setIsCompleted(true);
        setTimerEndTime(Date.now());
        setShouldShowModal(true);

        // 타이머 완료 이벤트 발송
        window.dispatchEvent(new CustomEvent(TIMER_COMPLETED_EVENT));
      }

      return newTime;
    });

    saveTimerState();
  }, [saveTimerState]);

  // 페이지 가시성 변경 처리
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // 페이지가 숨겨질 때 상태 저장
        lastSavedTimeRef.current = Date.now();
        saveTimerState();

        // 활성 상태이면 인터벌 정리 (배터리 절약)
        if (isActive && timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      } else if (document.visibilityState === "visible" && isActive) {
        // 페이지가 다시 표시되고 타이머가 활성 상태였다면
        const now = Date.now();
        const elapsedSinceHidden = Math.floor(
          (now - lastSavedTimeRef.current) / 1000
        );

        // 시간 조정
        setTime((prevTime) => {
          const adjustedTime = Math.max(0, prevTime - elapsedSinceHidden);

          if (adjustedTime === 0 && prevTime > 0) {
            // 숨겨진 동안 타이머가 완료됨
            setIsActive(false);
            setIsCompleted(true);
            setTimerEndTime(now);
            setShouldShowModal(true);

            // 타이머 완료 이벤트 발송
            window.dispatchEvent(new CustomEvent(TIMER_COMPLETED_EVENT));
          } else if (adjustedTime > 0 && isActive) {
            // 타이머 재시작
            startTimer();
          }

          return adjustedTime;
        });
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, saveTimerState, startTimer]);

  // 초기 상태 복원
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(TIMER_STATE_KEY);

      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);

        // 저장된 상태가 활성 상태였다면 경과 시간 계산
        if (savedState.isActive) {
          const now = Date.now();
          const elapsed = savedState.lastSavedAt
            ? Math.floor((now - savedState.lastSavedAt) / 1000)
            : 0;

          // 남은 시간 계산
          const remainingTime = Math.max(0, savedState.time - elapsed);

          // 상태 복원
          setIsActive(remainingTime > 0);
          setTime(remainingTime);
          setTimerStartTime(savedState.timerStartTime);
          setHasAddedTime(savedState.hasAddedTime || false);

          // 타이머가 완료되었는지 확인
          if (remainingTime === 0 && savedState.time > 0) {
            setIsCompleted(true);
            setTimerEndTime(now);
            setShouldShowModal(true);
          } else {
            setIsCompleted(savedState.isCompleted || false);
            setTimerEndTime(savedState.timerEndTime);
            setShouldShowModal(savedState.shouldShowModal || false);
          }

          // 활성 상태였다면 타이머 재시작
          if (remainingTime > 0 && savedState.isActive) {
            // 약간 지연 후 타이머 시작 (상태 업데이트가 완료될 시간 부여)
            setTimeout(() => startTimer(), 0);
          }
        } else {
          // 비활성 상태였다면 그대로 복원
          setIsActive(false);
          setTime(savedState.time || DEFAULT_TIMER_TIME);
          setTimerStartTime(savedState.timerStartTime);
          setTimerEndTime(savedState.timerEndTime);
          setHasAddedTime(savedState.hasAddedTime || false);
          setIsCompleted(savedState.isCompleted || false);
          setShouldShowModal(savedState.shouldShowModal || false);
        }

        console.log("[TimerContext] 타이머 상태 복원됨");
      }
    } catch (error) {
      console.error("[TimerContext] 타이머 상태 복원 중 오류 발생:", error);
      resetTimer();
    }
  }, [resetTimer, startTimer]);

  // 언마운트 또는 페이지 이탈 시 상태 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveTimerState();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // 인터벌 정리
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      // 이벤트 리스너 제거
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // 상태 저장
      saveTimerState();
    };
  }, [saveTimerState]);

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
