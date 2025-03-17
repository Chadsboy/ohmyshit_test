// 타이머 완료 이벤트
export const TIMER_COMPLETED_EVENT = "timer-completed";

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
