import { StateCreator } from "zustand";
import { TIMER_COMPLETED_EVENT } from "../timerEvents";

// 기본 타이머 시간 (8분 = 480초)
const INITIAL_TIME = 480;

export interface TimerSlice {
  // 상태
  isActive: boolean;
  time: number;
  timerStartTime: number | null;
  timerEndTime: number | null;
  hasAddedTime: boolean;
  interval: NodeJS.Timeout | null;
  lastActive: number | null;
  lastUpdateTime: number | null;
  isCompleted: boolean;
  shouldShowModal: boolean;

  // 액션
  setIsActive: (isActive: boolean) => void;
  setTime: (time: number) => void;
  setHasAddedTime: (hasAddedTime: boolean) => void;
  setInterval: (interval: NodeJS.Timeout | null) => void;
  setShouldShowModal: (shouldShowModal: boolean) => void;
  resetTimer: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  addTime: (seconds: number) => void;
}

export const createTimerSlice: StateCreator<TimerSlice> = (set, get) => ({
  // 초기 상태
  isActive: false,
  time: INITIAL_TIME,
  timerStartTime: null,
  timerEndTime: null,
  hasAddedTime: false,
  interval: null,
  lastActive: null,
  lastUpdateTime: null,
  isCompleted: false,
  shouldShowModal: false,

  // 세터 함수들
  setIsActive: (isActive) => set({ isActive }),
  setTime: (time) => set({ time }),
  setHasAddedTime: (hasAddedTime) => set({ hasAddedTime }),
  setInterval: (interval) => set({ interval }),
  setShouldShowModal: (shouldShowModal) => set({ shouldShowModal }),

  // 타이머 리셋
  resetTimer: () => {
    const { interval } = get();

    // 기존 인터벌 제거
    if (interval) {
      clearInterval(interval);
    }

    set({
      isActive: false,
      time: INITIAL_TIME,
      timerStartTime: null,
      timerEndTime: null,
      hasAddedTime: false,
      interval: null,
      lastActive: null,
      lastUpdateTime: null,
      isCompleted: false,
      shouldShowModal: false,
    });
  },

  // 타이머 시작
  startTimer: () => {
    const { interval, time, isActive } = get();

    // 이미 활성화되어 있으면 아무것도 하지 않음
    if (isActive) return;

    // 기존 인터벌 제거
    if (interval) {
      clearInterval(interval);
    }

    // 현재 시간 기록
    const now = Date.now();
    const endTime = now + time * 1000;

    // 타이머 인터벌 설정
    const newInterval = setInterval(() => {
      const { time, isActive } = get();

      // 타이머가 활성화 상태가 아니면 인터벌 제거
      if (!isActive) {
        const { interval } = get();
        if (interval) {
          clearInterval(interval);
          set({ interval: null });
        }
        return;
      }

      // 타이머 시간 감소
      if (time <= 1) {
        // 타이머 완료
        const { interval } = get();
        if (interval) {
          clearInterval(interval);
        }

        // 타이머 완료 이벤트 발생
        window.dispatchEvent(new CustomEvent(TIMER_COMPLETED_EVENT));

        set({
          time: 0,
          isActive: false,
          interval: null,
          isCompleted: true,
          shouldShowModal: true,
        });
      } else {
        set({ time: time - 1 });
      }
    }, 1000);

    // 상태 업데이트
    set({
      isActive: true,
      timerStartTime: now,
      timerEndTime: endTime,
      interval: newInterval,
      lastActive: now,
      lastUpdateTime: now,
    });
  },

  // 타이머 일시정지
  pauseTimer: () => {
    const { interval, isActive } = get();

    // 활성화되어 있지 않으면 아무것도 하지 않음
    if (!isActive) return;

    // 인터벌 제거
    if (interval) {
      clearInterval(interval);
    }

    // 상태 업데이트
    set({
      isActive: false,
      interval: null,
      lastActive: Date.now(),
    });
  },

  // 타이머에 시간 추가 (초 단위)
  addTime: (seconds) => {
    const { time, hasAddedTime } = get();

    // 이미 시간을 추가했으면 아무것도 하지 않음
    if (hasAddedTime) return;

    // 상태 업데이트
    set({
      time: time + seconds,
      hasAddedTime: true,
    });
  },
});
