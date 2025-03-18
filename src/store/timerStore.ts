import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createTimerSlice, TimerSlice } from "./slices/timerSlice";
import { setupBrowserEvents } from "../utils/browserEventHandlers";
import { TIMER_COMPLETED_EVENT } from "./timerEvents";

// 타이머의 기본 시간(8분 = 480초)
const DEFAULT_TIMER_TIME = 8 * 60;

// 글로벌 타이머 인터벌 레퍼런스
let timerInterval: NodeJS.Timeout | null = null;

// 타이머 상태 인터페이스
interface TimerState {
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
  restoreTimerState: (state: Partial<TimerState>) => void;
}

// 지속성 옵션 설정
const persistOptions = {
  name: "timer-storage",
  storage: createJSONStorage(() => localStorage),
};

// 타이머 스토어 생성
export const useTimerStore = create<TimerState>((set, get) => ({
  // 초기 상태
  isActive: false,
  time: DEFAULT_TIMER_TIME,
  timerStartTime: null,
  timerEndTime: null,
  hasAddedTime: false,
  isCompleted: false,
  shouldShowModal: false,

  // 액션 정의
  setActive: (active: boolean) => set({ isActive: active }),

  setTime: (time: number) => set({ time }),

  startTimer: () => {
    // 이미 활성화된 타이머가 있으면 리턴
    if (get().isActive) return;

    // 기존 인터벌 제거
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    // 타이머 시작
    set((state) => ({
      isActive: true,
      timerStartTime: state.timerStartTime || Date.now(),
    }));

    // 타이머 인터벌 시작
    timerInterval = setInterval(() => {
      const state = get();

      if (state.isActive && state.time > 0) {
        const newTime = state.time - 1;

        // 타이머가 완료되었을 때 (0이 됐을 때)
        if (newTime === 0) {
          // 타이머 완료 이벤트 발생
          window.dispatchEvent(new CustomEvent(TIMER_COMPLETED_EVENT));

          // 타이머 상태 업데이트
          set({
            time: 0,
            isActive: false,
            isCompleted: true,
            timerEndTime: Date.now(),
            shouldShowModal: true,
          });

          // 인터벌 제거
          if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
        } else {
          // 일반적인 감소
          set({ time: newTime });
        }
      } else if (!state.isActive && timerInterval) {
        // 타이머가 비활성화되었을 때 인터벌 제거
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }, 1000);
  },

  pauseTimer: () => {
    // 타이머 정지
    set({ isActive: false });

    // 인터벌 제거
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  },

  resetTimer: () => {
    // 타이머 리셋
    set({
      isActive: false,
      time: DEFAULT_TIMER_TIME,
      timerStartTime: null,
      timerEndTime: null,
      hasAddedTime: false,
      isCompleted: false,
      shouldShowModal: false,
    });

    // 인터벌 제거
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  },

  addTime: (seconds: number) =>
    set((state) => ({
      time: state.time + seconds,
      hasAddedTime: true,
    })),

  decrementTime: () =>
    set((state) => {
      // 시간이 0보다 큰 경우만 감소
      if (state.time <= 0) return state;

      // 새 시간 값
      const newTime = state.time - 1;

      // 타이머가 완료되었을 때 (0이 됐을 때)
      if (newTime === 0) {
        // 타이머 완료 이벤트 발생
        window.dispatchEvent(new CustomEvent(TIMER_COMPLETED_EVENT));

        return {
          time: newTime,
          isActive: false,
          isCompleted: true,
          timerEndTime: Date.now(),
          shouldShowModal: true,
        };
      }

      // 일반적인 감소만 수행
      return { time: newTime };
    }),

  setIsCompleted: (completed: boolean) => set({ isCompleted: completed }),

  setShouldShowModal: (show: boolean) => set({ shouldShowModal: show }),

  restoreTimerState: (savedState: Partial<TimerState>) =>
    set((state) => {
      // 이전에 활성화되었던 타이머라면 다시 시작
      if (savedState.isActive) {
        setTimeout(() => get().startTimer(), 0);
      }

      return {
        ...state,
        ...savedState,
      };
    }),
}));

// 브라우저 이벤트 설정
setupBrowserEvents(useTimerStore);
