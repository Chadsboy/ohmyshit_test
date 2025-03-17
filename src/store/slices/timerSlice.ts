import { StateCreator } from "zustand";
import {
  TIMER_COMPLETED_EVENT,
  dispatchTimerCompletedEvent,
} from "../timerEvents";

// 초기 타이머 시간 (8분)
export const INITIAL_TIME = 8 * 60;

/**
 * 타이머 슬라이스 인터페이스
 */
export interface TimerSlice {
  isActive: boolean;
  time: number;
  timerStartTime: Date | null;
  timerEndTime: Date | null;
  hasAddedTime: boolean;
  interval: NodeJS.Timeout | null;
  lastActive: boolean; // 페이지 가시성 변경 전 활성 상태
  lastUpdateTime: number; // 마지막 업데이트 시간 (타임스탬프)
  isCompleted: boolean; // 타이머 완료 상태
  shouldShowModal: boolean; // 결과 모달 표시 여부

  // 상태 설정 함수
  setActive: (isActive: boolean) => void;
  setTime: (time: number) => void;
  setTimerStartTime: (time: Date | null) => void;
  setTimerEndTime: (time: Date | null) => void;
  setHasAddedTime: (hasAdded: boolean) => void;
  setLastActive: (lastActive: boolean) => void;
  setLastUpdateTime: (time: number) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  setShouldShowModal: (shouldShowModal: boolean) => void;

  // 액션 함수
  resetTimer: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  addTime: () => void;
}

/**
 * 타이머 슬라이스 생성 함수
 */
export const createTimerSlice: StateCreator<TimerSlice> = (set, get) => ({
  // 초기 상태
  isActive: false,
  time: INITIAL_TIME,
  timerStartTime: null,
  timerEndTime: null,
  hasAddedTime: false,
  interval: null,
  lastActive: false,
  lastUpdateTime: Date.now(),
  isCompleted: false,
  shouldShowModal: false,

  // 상태 설정 함수
  setActive: (isActive) => set({ isActive }),
  setTime: (time) => set({ time }),
  setTimerStartTime: (time) => set({ timerStartTime: time }),
  setTimerEndTime: (time) => set({ timerEndTime: time }),
  setHasAddedTime: (hasAdded) => set({ hasAddedTime: hasAdded }),
  setLastActive: (lastActive) => set({ lastActive }),
  setLastUpdateTime: (time) => set({ lastUpdateTime: time }),
  setIsCompleted: (isCompleted) => set({ isCompleted }),
  setShouldShowModal: (shouldShowModal) => set({ shouldShowModal }),

  // 타이머 리셋
  resetTimer: () => {
    // 기존 인터벌 제거
    const interval = get().interval;
    if (interval) clearInterval(interval);

    set({
      isActive: false,
      time: INITIAL_TIME,
      timerStartTime: null,
      timerEndTime: null,
      hasAddedTime: false,
      interval: null,
      lastActive: false,
      lastUpdateTime: Date.now(),
      isCompleted: false,
      shouldShowModal: false,
    });
  },

  // 타이머 시작
  startTimer: () => {
    const { interval, isActive, isCompleted } = get();

    // 타이머가 완료된 상태면 리셋 후 시작
    if (isCompleted) {
      get().resetTimer();
      // 약간의 지연 후 타이머 시작 (상태 업데이트가 적용될 시간 확보)
      setTimeout(() => {
        get().startTimer();
      }, 100);
      return;
    }

    // 이미 타이머가 작동 중이면 무시
    if (isActive) return;

    // 기존 인터벌 제거
    if (interval) clearInterval(interval);

    // 타이머 시작 시간 설정
    const timerStartTime = get().timerStartTime || new Date();

    // 새 인터벌 시작
    const newInterval = setInterval(() => {
      const currentTime = get().time;
      const newTime = currentTime - 1;

      if (newTime <= 0) {
        // 타이머 종료
        const { interval } = get();
        if (interval) clearInterval(interval);

        set({
          isActive: false,
          time: 0,
          timerEndTime: new Date(),
          interval: null,
          lastActive: false,
          lastUpdateTime: Date.now(),
          isCompleted: true,
          shouldShowModal: true,
        });

        // 타이머 완료 이벤트 발생
        if (typeof window !== "undefined") {
          dispatchTimerCompletedEvent();
        }
      } else {
        // 타이머 진행
        set({
          time: newTime,
          lastUpdateTime: Date.now(),
        });
      }
    }, 1000);

    // 상태 업데이트
    set({
      isActive: true,
      timerStartTime,
      interval: newInterval,
      lastActive: true,
      lastUpdateTime: Date.now(),
      isCompleted: false,
      shouldShowModal: false,
    });
  },

  // 타이머 일시정지
  pauseTimer: () => {
    const { interval } = get();

    // 인터벌 제거
    if (interval) clearInterval(interval);

    // 상태 업데이트
    set({
      isActive: false,
      timerEndTime: new Date(),
      interval: null,
      lastActive: false,
      lastUpdateTime: Date.now(),
    });
  },

  // 시간 추가 (1분)
  addTime: () => {
    const { hasAddedTime, time } = get();

    if (!hasAddedTime) {
      set({
        time: time + 60, // 1분(60초) 추가
        hasAddedTime: true, // 한 번만 추가할 수 있도록 설정
        lastUpdateTime: Date.now(),
      });
    }
  },
});
