import {
  TIMER_COMPLETED_EVENT,
  TIMER_SAVE_STATE_EVENT,
  TIMER_RESTORE_STATE_EVENT,
} from "../store/timerEvents";

// 타이머 상태 저장을 위한 로컬 스토리지 키
const TIMER_STATE_KEY = "timerState";

// 페이지 로드 시 타이머 상태 복원
export const handlePageLoad = () => {
  try {
    // 로컬 스토리지에서 타이머 상태 가져오기
    const savedStateJSON = localStorage.getItem(TIMER_STATE_KEY);

    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);

      // 타이머가 활성화 상태였다면 페이지 언로드 시간 계산
      if (savedState.isActive) {
        // 현재 시간과 저장된 시간의 차이 계산
        const now = Date.now();
        const elapsedTimeInSeconds = savedState.lastSavedAt
          ? Math.floor((now - savedState.lastSavedAt) / 1000)
          : 0;

        // 남은 시간 계산
        const remainingTime = Math.max(
          0,
          savedState.time - elapsedTimeInSeconds
        );

        // 0초라면 타이머 완료 이벤트 발생
        if (remainingTime === 0) {
          savedState.isActive = false;
          savedState.isCompleted = true;
          savedState.shouldShowModal = true;
          savedState.time = 0;

          // 완료 이벤트 발생
          window.dispatchEvent(new CustomEvent(TIMER_COMPLETED_EVENT));
        } else {
          // 시간 업데이트
          savedState.time = remainingTime;
        }
      }

      // 복원 이벤트 발생
      window.dispatchEvent(
        new CustomEvent(TIMER_RESTORE_STATE_EVENT, { detail: savedState })
      );

      console.log("타이머 상태 복원됨:", savedState);
    }
  } catch (error) {
    console.error("타이머 상태 복원 중 오류 발생:", error);
  }
};

// 타이머 상태 저장
export const saveTimerState = (timerState: any) => {
  try {
    // 현재 시간을 추가하여 저장
    const stateToSave = {
      ...timerState,
      lastSavedAt: Date.now(),
    };

    // 로컬 스토리지에 상태 저장
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(stateToSave));
    console.log("타이머 상태 저장됨:", stateToSave);
  } catch (error) {
    console.error("타이머 상태 저장 중 오류 발생:", error);
  }
};

// 페이지 가시성 변경 시 처리
export const handleVisibilityChange = (timerState: any) => {
  if (document.visibilityState === "hidden") {
    // 페이지가 숨겨질 때 타이머 상태 저장
    if (timerState.isActive) {
      saveTimerState(timerState);
    }
  } else if (document.visibilityState === "visible") {
    // 페이지가 다시 보일 때 타이머 상태 복원
    handlePageLoad();
  }
};

// 타이머 완료 시 사운드 재생
export const playTimerCompletionSound = () => {
  try {
    const audio = new Audio("/sounds/timer-complete.mp3");
    audio.play().catch((error) => {
      console.warn("타이머 완료 사운드 재생 실패:", error);
    });
  } catch (error) {
    console.error("타이머 완료 사운드 재생 중 오류 발생:", error);
  }
};

// 브라우저 이벤트 핸들러 설정
export const setupBrowserEvents = (getTimerState: () => any) => {
  // 페이지 로드 시 타이머 상태 복원
  window.addEventListener("load", handlePageLoad);

  // 페이지 가시성 변경 시 처리
  document.addEventListener("visibilitychange", () => {
    handleVisibilityChange(getTimerState());
  });

  // 브라우저 탭/창 닫힐 때 타이머 상태 저장
  window.addEventListener("beforeunload", () => {
    saveTimerState(getTimerState());
  });

  // 타이머 완료 이벤트 처리
  window.addEventListener(TIMER_COMPLETED_EVENT, () => {
    playTimerCompletionSound();
  });

  // 타이머 상태 저장 이벤트 처리
  window.addEventListener(TIMER_SAVE_STATE_EVENT, (event: CustomEvent) => {
    saveTimerState(event.detail || getTimerState());
  });

  return () => {
    // 이벤트 리스너 정리
    window.removeEventListener("load", handlePageLoad);
    document.removeEventListener("visibilitychange", () =>
      handleVisibilityChange(getTimerState())
    );
    window.removeEventListener("beforeunload", () =>
      saveTimerState(getTimerState())
    );
    window.removeEventListener(TIMER_COMPLETED_EVENT, playTimerCompletionSound);
    window.removeEventListener(TIMER_SAVE_STATE_EVENT, (event: CustomEvent) =>
      saveTimerState(event.detail || getTimerState())
    );
  };
};
