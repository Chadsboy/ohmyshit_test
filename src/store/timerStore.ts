import { create } from "zustand";
import { persist, PersistOptions, createJSONStorage } from "zustand/middleware";
import { createTimerSlice, TimerSlice } from "./slices/timerSlice";
import { setupBrowserEvents } from "../utils/browserEventHandlers";
import { TIMER_COMPLETED_EVENT } from "./timerEvents";

// TimerStore 타입 정의
export type TimerState = TimerSlice;

// 저장할 상태의 타입 정의
type TimerStatePersist = {
  isActive: boolean;
  time: number;
  timerStartTime: Date | null;
  timerEndTime: Date | null;
  hasAddedTime: boolean;
  lastActive: boolean;
  lastUpdateTime: number;
  isCompleted: boolean;
  shouldShowModal: boolean;
};

// 영속성 옵션 설정
const persistOptions: PersistOptions<TimerState, TimerStatePersist> = {
  name: "timer-storage",
  // localStorage 사용 - 새로고침해도 상태 유지, 브라우저 닫으면 초기화
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    isActive: state.isActive,
    time: state.time,
    timerStartTime: state.timerStartTime,
    timerEndTime: state.timerEndTime,
    hasAddedTime: state.hasAddedTime,
    lastActive: state.lastActive,
    lastUpdateTime: state.lastUpdateTime,
    isCompleted: state.isCompleted,
    shouldShowModal: state.shouldShowModal,
  }),
};

// 타이머 스토어 생성
export const useTimerStore = create<TimerState>()(
  persist(
    (...args) => ({
      ...createTimerSlice(...args),
    }),
    persistOptions
  )
);

// 브라우저 이벤트 설정
if (typeof window !== "undefined") {
  setupBrowserEvents(useTimerStore);
}
