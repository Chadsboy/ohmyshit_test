import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 타이머의 기본 시간(8분 = 480초)
const DEFAULT_TIMER_TIME = 8 * 60;

export interface TimerState {
  isActive: boolean;
  time: number;
  timerStartTime: number | null;
  timerEndTime: number | null;
  hasAddedTime: boolean;
  isCompleted: boolean;
  shouldShowModal: boolean;
}

const initialState: TimerState = {
  isActive: false,
  time: DEFAULT_TIMER_TIME,
  timerStartTime: null,
  timerEndTime: null,
  hasAddedTime: false,
  isCompleted: false,
  shouldShowModal: false,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    // 타이머 시작
    startTimer: (state) => {
      state.isActive = true;
      if (!state.timerStartTime) {
        state.timerStartTime = Date.now();
      }
    },

    // 타이머 일시 정지
    pauseTimer: (state) => {
      state.isActive = false;
    },

    // 타이머 리셋
    resetTimer: (state) => {
      state.isActive = false;
      state.time = DEFAULT_TIMER_TIME;
      state.timerStartTime = null;
      state.timerEndTime = null;
      state.hasAddedTime = false;
      state.isCompleted = false;
      state.shouldShowModal = false;
    },

    // 타이머 시간 설정
    setTime: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
    },

    // 타이머 활성화 상태 설정
    setActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },

    // 타이머에 시간 추가 (초)
    addTime: (state, action: PayloadAction<number>) => {
      state.time += action.payload;
      state.hasAddedTime = true;
    },

    // 타이머 카운트다운 (1초)
    decrementTime: (state) => {
      if (state.time > 0) {
        state.time -= 1;
      }

      if (state.time === 0) {
        state.isActive = false;
        state.isCompleted = true;
        state.timerEndTime = Date.now();
        state.shouldShowModal = true;
      }
    },

    // 타이머 완료 상태 설정
    setIsCompleted: (state, action: PayloadAction<boolean>) => {
      state.isCompleted = action.payload;
    },

    // 결과 모달 표시 여부 설정
    setShouldShowModal: (state, action: PayloadAction<boolean>) => {
      state.shouldShowModal = action.payload;
    },

    // 타이머 상태 복원 (앱 다시 시작 시)
    restoreTimerState: (state, action: PayloadAction<Partial<TimerState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  startTimer,
  pauseTimer,
  resetTimer,
  setTime,
  setActive,
  addTime,
  decrementTime,
  setIsCompleted,
  setShouldShowModal,
  restoreTimerState,
} = timerSlice.actions;

export default timerSlice.reducer;
