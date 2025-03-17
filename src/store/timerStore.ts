import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimerState {
  isActive: boolean;
  time: number;
  timerStartTime: Date | null;
  timerEndTime: Date | null;
  hasAddedTime: boolean;
  setActive: (isActive: boolean) => void;
  setTime: (time: number) => void;
  setTimerStartTime: (time: Date | null) => void;
  setTimerEndTime: (time: Date | null) => void;
  setHasAddedTime: (hasAdded: boolean) => void;
  resetTimer: () => void;
}

const INITIAL_TIME = 8 * 60; // 8분

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      isActive: false,
      time: INITIAL_TIME,
      timerStartTime: null,
      timerEndTime: null,
      hasAddedTime: false,
      setActive: (isActive) => set({ isActive }),
      setTime: (time) => set({ time }),
      setTimerStartTime: (time) => set({ timerStartTime: time }),
      setTimerEndTime: (time) => set({ timerEndTime: time }),
      setHasAddedTime: (hasAdded) => set({ hasAddedTime: hasAdded }),
      resetTimer: () =>
        set({
          isActive: false,
          time: INITIAL_TIME,
          timerStartTime: null,
          timerEndTime: null,
          hasAddedTime: false,
        }),
    }),
    {
      name: "timer-storage",
      partialize: (state) => ({
        time: state.time,
        isActive: state.isActive,
        timerStartTime: state.timerStartTime,
        timerEndTime: state.timerEndTime,
        hasAddedTime: state.hasAddedTime,
      }),
    }
  )
);
