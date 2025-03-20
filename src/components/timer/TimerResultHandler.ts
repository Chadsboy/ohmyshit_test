import { getCurrentUser } from "../../services/auth";
import { BowelRecordService } from "../../services/bowelRecordService";
import { calculateRecordDate } from "../../utils/dateHelpers";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 시간대 상수
const KOREA_TIMEZONE = "Asia/Seoul";

// 배변량 타입
export type StoolAmount = "많음" | "보통" | "적음" | "이상" | "";

/**
 * 타이머 결과 처리 클래스
 * 타이머를 통한 배변 기록을 BowelRecordService를 통해 일관되게 저장합니다.
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

    // 종료 시간이 없는 경우, 현재 시간으로 설정
    const endTime = timerEndTime || new Date();

    // 시간 차이 계산 (분 단위)
    const durationInMinutes = Math.round(
      (endTime.getTime() - timerStartTime.getTime()) / (1000 * 60)
    );

    try {
      // 한국 시간으로 변환
      const koreanDate = calculateRecordDate(timerStartTime);

      // 한국 시간 형식으로 변환 (시간:분)
      // 이전에는 UTC 시간을 사용하여 잘못된 시간이 기록됨
      const koreanDateTime = dayjs(timerStartTime).tz(KOREA_TIMEZONE);
      const hours = koreanDateTime.format("HH");
      const minutes = koreanDateTime.format("mm");
      const timeString = `${hours}:${minutes}`;

      console.log(
        `[TimerResultHandler] 타이머 시작 시간 (UTC): ${timerStartTime.toISOString()}`
      );
      console.log(
        `[TimerResultHandler] 타이머 시작 시간 (한국): ${koreanDateTime.format()}`
      );
      console.log(
        `[TimerResultHandler] 한국 날짜: ${koreanDate}, 시간: ${timeString}`
      );

      // BowelRecordService를 사용하여 기록 저장 (직접 입력과 동일한 경로 사용)
      const result = await BowelRecordService.createRecord(
        koreanDate, // 날짜 (YYYY-MM-DD)
        timeString, // 시간 (HH:MM)
        durationInMinutes, // 소요 시간 (분)
        true, // 성공 여부
        stoolAmount || null, // 배변량
        memo || null // 메모
      );

      if (result.error) {
        throw result.error;
      }

      console.log(
        "[TimerResultHandler] 배변 기록 성공적으로 저장:",
        result.data
      );
      return result.data;
    } catch (err) {
      console.error("[TimerResultHandler] 배변 기록 저장 중 예외 발생:", err);
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
      // 한국 시간으로 변환
      const koreanDate = calculateRecordDate(timerStartTime);

      // 한국 시간 형식으로 변환 (시간:분)
      // 이전에는 UTC 시간을 사용하여 잘못된 시간이 기록됨
      const koreanDateTime = dayjs(timerStartTime).tz(KOREA_TIMEZONE);
      const hours = koreanDateTime.format("HH");
      const minutes = koreanDateTime.format("mm");
      const timeString = `${hours}:${minutes}`;

      console.log(
        `[TimerResultHandler] 타이머 시작 시간 (UTC): ${timerStartTime.toISOString()}`
      );
      console.log(
        `[TimerResultHandler] 타이머 시작 시간 (한국): ${koreanDateTime.format()}`
      );
      console.log(
        `[TimerResultHandler] 한국 날짜: ${koreanDate}, 시간: ${timeString}`
      );

      // BowelRecordService를 사용하여 기록 저장 (직접 입력과 동일한 경로 사용)
      const result = await BowelRecordService.createRecord(
        koreanDate, // 날짜 (YYYY-MM-DD)
        timeString, // 시간 (HH:MM)
        durationInMinutes, // 소요 시간 (분)
        false, // 성공 여부
        null, // 배변량 (실패 시 null)
        "실패" // 메모
      );

      if (result.error) {
        throw result.error;
      }

      console.log(
        "[TimerResultHandler] 배변 기록(실패) 성공적으로 저장:",
        result.data
      );
      return result.data;
    } catch (err) {
      console.error(
        "[TimerResultHandler] 배변 기록(실패) 저장 중 예외 발생:",
        err
      );
      throw err;
    }
  }
}
