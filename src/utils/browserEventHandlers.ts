import { StoreApi } from "zustand";
import { TimerSlice } from "../store/slices/timerSlice";
import {
  TIMER_COMPLETED_EVENT,
  dispatchTimerCompletedEvent,
} from "../store/timerEvents";

// 페이지 로드 시간 기록 (새로고침 감지용)
const pageLoadTime = new Date().getTime();

// 실제 새로고침 여부 파악용 플래그
let isRealRefresh = true;

/**
 * 브라우저 이벤트 설정
 * @param store 타이머 스토어
 */
export const setupBrowserEvents = (store: StoreApi<TimerSlice>) => {
  setupBeforeUnloadEvent();
  setupPageLoadEvent(store);
  setupVisibilityChangeEvent(store);
  setupRefreshDetection(store);
};

/**
 * beforeunload 이벤트 설정
 */
const setupBeforeUnloadEvent = () => {
  window.addEventListener("beforeunload", () => {
    isRealRefresh = true;

    // 인터벌 정리
    const interval = window.timerInterval;
    if (interval) clearInterval(interval);
  });
};

/**
 * 페이지 로드 이벤트 설정
 */
const setupPageLoadEvent = (store: StoreApi<TimerSlice>) => {
  window.addEventListener("load", () => {
    // 백그라운드에 저장된 상태 확인
    const savedBgState = localStorage.getItem("timer_background_state");

    if (savedBgState) {
      try {
        const bgState = JSON.parse(savedBgState);
        const currentTime = Date.now();
        const timePassed = Math.floor(
          (currentTime - bgState.lastUpdateTime) / 1000
        );
        const timerStore = store.getState();

        // 상태 복원
        if (bgState.isCompleted) {
          // 타이머가 완료된 상태
          timerStore.setTime(0);
          timerStore.setIsCompleted(true);
          timerStore.setShouldShowModal(true);

          // 타이머 완료 이벤트 발생
          dispatchTimerCompletedEvent();
        } else if (bgState.lastActive) {
          // 타이머가 활성화된 상태
          // 시간 차이 반영
          if (timePassed > 0 && bgState.time > timePassed) {
            timerStore.setTime(bgState.time - timePassed);
          } else if (bgState.time <= timePassed) {
            // 백그라운드에서 타이머가 완료된 경우
            timerStore.setTime(0);
            timerStore.setIsCompleted(true);
            timerStore.setShouldShowModal(true);
            dispatchTimerCompletedEvent();
          } else {
            timerStore.setTime(bgState.time);
          }

          // 기타 상태 복원
          timerStore.setHasAddedTime(bgState.hasAddedTime);

          // 타이머가 완료되지 않았으면 재시작
          if (!timerStore.isCompleted) {
            // 지연된 타이머 시작 (Safari의 DOM 완전 로드 대기)
            setTimeout(() => {
              timerStore.startTimer();
            }, 300);
          }
        }

        // 백그라운드 상태 정보 삭제 (1초 후에 삭제하여 중복 로드 방지)
        setTimeout(() => {
          localStorage.removeItem("timer_background_state");
        }, 1000);
      } catch (error) {
        console.error("백그라운드 상태 복원 중 오류:", error);
      }
    }
  });
};

/**
 * 페이지 가시성 변경 이벤트 설정
 */
const setupVisibilityChangeEvent = (store: StoreApi<TimerSlice>) => {
  document.addEventListener("visibilitychange", () => {
    handleVisibilityChange(store);
  });
};

/**
 * 페이지 가시성 변경 처리
 */
const handleVisibilityChange = (store: StoreApi<TimerSlice>) => {
  const timerStore = store.getState();

  if (document.visibilityState === "hidden") {
    // 페이지가 숨겨질 때 (다른 앱으로 전환될 때)
    saveTimerStateToBackground(timerStore);
  } else if (document.visibilityState === "visible") {
    // 페이지가 다시 보일 때 (앱으로 다시 돌아왔을 때)
    restoreTimerStateFromBackground(timerStore);
  }
};

/**
 * 타이머 상태를 백그라운드에 저장
 */
const saveTimerStateToBackground = (timerStore: TimerSlice) => {
  timerStore.setLastActive(timerStore.isActive);

  // 타이머가 실행 중이면 인터벌 정리
  if (timerStore.interval) {
    clearInterval(timerStore.interval);
    timerStore.setActive(false);
  }

  // 백그라운드로 전환되는 시점의 상태를 추가로 저장
  const bgState = {
    isActive: timerStore.isActive,
    time: timerStore.time,
    lastActive: timerStore.isActive,
    lastUpdateTime: Date.now(),
    hasAddedTime: timerStore.hasAddedTime,
    isCompleted: timerStore.isCompleted,
    shouldShowModal: timerStore.shouldShowModal,
  };

  localStorage.setItem("timer_background_state", JSON.stringify(bgState));

  // 세션 스토리지에도 동일하게 저장 (추가 백업)
  try {
    sessionStorage.setItem("timer_background_state", JSON.stringify(bgState));
  } catch (e) {
    console.error("세션 스토리지 저장 실패:", e);
  }

  isRealRefresh = false; // 실제 새로고침이 아님을 표시
};

/**
 * 백그라운드에서 타이머 상태 복원
 */
const restoreTimerStateFromBackground = (timerStore: TimerSlice) => {
  const currentTime = Date.now();

  // 백그라운드에 저장된 상태 확인 (먼저 세션 스토리지 확인, 없으면 로컬 스토리지 확인)
  let savedBgState = null;
  try {
    const sessionData = sessionStorage.getItem("timer_background_state");
    if (sessionData) {
      savedBgState = sessionData;
      sessionStorage.removeItem("timer_background_state");
    } else {
      savedBgState = localStorage.getItem("timer_background_state");
    }
  } catch (e) {
    savedBgState = localStorage.getItem("timer_background_state");
  }

  if (savedBgState) {
    try {
      const bgState = JSON.parse(savedBgState);
      const timePassed = Math.floor(
        (currentTime - bgState.lastUpdateTime) / 1000
      );

      // 타이머 완료 상태 확인
      if (bgState.isCompleted || bgState.shouldShowModal) {
        // 타이머가 완료된 상태면 완료 상태 유지
        timerStore.setTime(0);
        timerStore.setIsCompleted(true);
        timerStore.setShouldShowModal(true);
        dispatchTimerCompletedEvent();
      } else if (bgState.lastActive) {
        // 이전에 타이머가 활성화 상태였다면 상태 복원
        // 시간 차이 반영
        if (timePassed > 0 && bgState.time > timePassed) {
          timerStore.setTime(bgState.time - timePassed);
        } else if (bgState.time <= timePassed) {
          // 백그라운드에서 타이머가 완료된 경우
          timerStore.setTime(0);
          timerStore.setIsCompleted(true);
          timerStore.setShouldShowModal(true);
          dispatchTimerCompletedEvent();
        } else {
          timerStore.setTime(bgState.time);
        }

        // 기타 상태 복원
        timerStore.setHasAddedTime(bgState.hasAddedTime);

        // 타이머가 완료되지 않았으면 재시작
        if (!timerStore.isCompleted) {
          timerStore.startTimer();
        }
      }

      // 백그라운드 상태 정보 삭제
      localStorage.removeItem("timer_background_state");
    } catch (error) {
      console.error("백그라운드 상태 복원 중 오류:", error);
    }
  } else {
    // 기존 로직 실행 (백그라운드 상태가 없는 경우)
    // 타이머가 완료된 상태인지 확인
    if (timerStore.isCompleted) {
      // 완료된 상태면 그대로 유지
      timerStore.setShouldShowModal(true);
      dispatchTimerCompletedEvent();
    } else if (timerStore.lastActive) {
      // 이전에 타이머가 활성화 상태였다면 재개
      const timePassed = Math.floor(
        (currentTime - timerStore.lastUpdateTime) / 1000
      );

      // 시간 차이 반영
      if (timePassed > 0 && timerStore.time > timePassed) {
        timerStore.setTime(timerStore.time - timePassed);
      } else if (timerStore.time <= timePassed) {
        // 백그라운드에서 타이머가 완료된 경우
        timerStore.setTime(0);
        timerStore.setIsCompleted(true);
        timerStore.setShouldShowModal(true);
        dispatchTimerCompletedEvent();
      }

      // 타이머가 완료되지 않았으면 재시작
      if (!timerStore.isCompleted) {
        timerStore.startTimer();
      }
    }
  }

  timerStore.setLastUpdateTime(currentTime);
};

/**
 * 페이지 새로고침 감지 및 타이머 초기화 설정
 */
const setupRefreshDetection = (store: StoreApi<TimerSlice>) => {
  // 실제 새로고침일 경우에만 타이머 초기화
  if (isRealRefresh) {
    // 마지막 페이지 로드 시간 체크
    const lastPageLoad = localStorage.getItem("lastPageLoad");

    // 앱이 종료되었다가 다시 시작된 경우(30초 이상 차이)는 초기화
    const timeDifference = lastPageLoad
      ? pageLoadTime - parseInt(lastPageLoad)
      : 0;

    const timerStore = store.getState();

    if (timeDifference > 30000) {
      // 앱 종료 후 재시작으로 간주하고 타이머 초기화
      timerStore.resetTimer();
    } else if (timerStore.isActive && !timerStore.isCompleted) {
      // 페이지 전환 후 돌아왔을 때 타이머가 활성화 상태이고 완료되지 않았으면 타이머 재시작
      timerStore.startTimer();
    } else if (timerStore.isCompleted) {
      // 타이머가 완료된 상태면 모달 표시
      timerStore.setShouldShowModal(true);
      dispatchTimerCompletedEvent();
    }
  }

  // 현재 로드 시간 저장
  localStorage.setItem("lastPageLoad", pageLoadTime.toString());
};

// 전역 타이머 인터벌 타입 확장
declare global {
  interface Window {
    timerInterval: NodeJS.Timeout | null;
  }
}
