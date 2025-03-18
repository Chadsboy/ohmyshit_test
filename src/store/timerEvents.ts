// 타이머 이벤트 상수
const TIMER_COMPLETED_EVENT = "timer-completed";
const TIMER_SAVE_STATE_EVENT = "timer-save-state";
const TIMER_RESTORE_STATE_EVENT = "timer-restore-state";

// 상수들 export
export {
  TIMER_COMPLETED_EVENT,
  TIMER_SAVE_STATE_EVENT,
  TIMER_RESTORE_STATE_EVENT,
};

/**
 * 타이머 완료 이벤트 발생
 */
export const dispatchTimerCompletedEvent = () => {
  // 타이머 완료 이벤트 발생
  const event = new CustomEvent(TIMER_COMPLETED_EVENT);
  window.dispatchEvent(event);
};

/**
 * 타이머 완료 이벤트 리스너 등록
 * @param callback 콜백 함수
 */
export const addTimerCompletedEventListener = (callback: () => void) => {
  window.addEventListener(TIMER_COMPLETED_EVENT, callback);
  return () => window.removeEventListener(TIMER_COMPLETED_EVENT, callback);
};
