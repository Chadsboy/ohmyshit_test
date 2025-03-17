import { createBowelRecord } from "../../services/bowelRecords";
import { getCurrentUser } from "../../services/auth";

// 배변량 타입
export type StoolAmount = "많음" | "보통" | "적음" | "이상" | "";

/**
 * 타이머 결과 처리 클래스
 */
export class TimerResultHandler {
  /**
   * 성공 처리
   */
  static async handleSuccess(
    stoolAmount: StoolAmount,
    memo: string,
    timerStartTime: Date | null,
    timerEndTime: Date | null
  ) {
    if (!timerStartTime) {
      console.error("타이머 시작 시간이 없습니다.");
      throw new Error("타이머 시작 시간이 없습니다.");
    }

    const endTime = timerEndTime || new Date();
    const durationInMinutes = Math.round(
      (endTime.getTime() - timerStartTime.getTime()) / (1000 * 60)
    );

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("사용자 인증 정보를 찾을 수 없습니다.");
      }

      const recordData = {
        user_id: currentUser.id,
        start_time: timerStartTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationInMinutes,
        success: true,
        amount: stoolAmount || null,
        memo: memo || null,
      };

      const { data, error } = await createBowelRecord(recordData);

      if (error) {
        console.error("배변 기록 저장 중 오류:", error);
        throw new Error("배변 기록 저장에 실패했습니다. 다시 시도해주세요.");
      }

      console.log("배변 기록이 성공적으로 저장되었습니다:", data);
      return data;
    } catch (err) {
      console.error("배변 기록 저장 중 예외 발생:", err);
      throw err;
    }
  }

  /**
   * 실패 처리
   */
  static async handleFail(
    timerStartTime: Date | null,
    timerEndTime: Date | null
  ) {
    if (!timerStartTime) {
      console.error("타이머 시작 시간이 없습니다.");
      throw new Error("타이머 시작 시간이 없습니다.");
    }

    // 종료 시간이 없는 경우, 현재 시간으로 설정
    const endTime = timerEndTime || new Date();

    // 시간 차이 계산 (분 단위)
    const durationInMinutes = Math.round(
      (endTime.getTime() - timerStartTime.getTime()) / (1000 * 60)
    );

    try {
      // 현재 인증된 사용자 정보 가져오기
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        throw new Error("사용자 인증 정보를 찾을 수 없습니다.");
      }

      // 실패한 배변 기록 저장
      const recordData = {
        user_id: currentUser.id,
        start_time: timerStartTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationInMinutes,
        success: false,
        amount: null,
        memo: "실패",
      };

      const { data, error } = await createBowelRecord(recordData);

      if (error) {
        console.error("배변 기록(실패) 저장 중 오류:", error);
        throw new Error("배변 기록 저장에 실패했습니다. 다시 시도해주세요.");
      }

      console.log("배변 기록(실패)이 성공적으로 저장되었습니다:", data);
      return data;
    } catch (err) {
      console.error("배변 기록(실패) 저장 중 예외 발생:", err);
      throw err;
    }
  }
}
