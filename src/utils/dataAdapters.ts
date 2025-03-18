import { BowelRecord, CalendarEvent } from "../types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  toKoreanTime,
  koreanDateTimeToUTC,
  KOREA_TIMEZONE,
  getKoreanDate,
  getKoreanTime,
} from "./dateHelpers";

// dayjs에 플러그인 추가
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 시간대 설정
dayjs.tz.setDefault(KOREA_TIMEZONE);

/**
 * BowelRecord 객체를 CalendarEvent 객체로 변환합니다.
 * 이를 통해 기존 UI 구조를 유지하면서 bowel_records 테이블을 사용할 수 있습니다.
 */
export const bowelRecordToCalendarEvent = (
  record: BowelRecord
): CalendarEvent => {
  // UTC 시간을 한국 시간으로 명시적으로 변환 (데이터베이스에는 UTC로 저장되어 있음)
  const startTimeUTC = record.start_time;

  // UTC 시간을 한국 시간대로 변환하여 날짜 추출
  const koreanDate = getKoreanDate(startTimeUTC);

  // 시간만 한국 시간으로 변환
  const koreanTime = getKoreanTime(startTimeUTC);

  // 성공/실패 상태와 배변량에 따라 제목 생성
  let title = record.success
    ? `배변 성공 (${koreanTime})`
    : `배변 시도 (${koreanTime})`;

  if (record.success && record.amount) {
    title += ` - ${record.amount}`;
  }

  // 설명 생성
  let description = `소요 시간: ${record.duration}분`;
  if (record.memo) {
    description += `\n메모: ${record.memo}`;
  }

  return {
    id: record.id,
    title,
    description,
    date: koreanDate, // 한국 시간 기준으로 변환된 날짜 사용
    created_at: record.created_at,
    user_id: record.user_id,
  };
};

/**
 * BowelRecord 배열을 CalendarEvent 배열로 변환합니다.
 */
export const bowelRecordsToCalendarEvents = (
  records: BowelRecord[]
): CalendarEvent[] => {
  return records.map(bowelRecordToCalendarEvent);
};

/**
 * CalendarEvent 데이터를 바탕으로 BowelRecord 생성 데이터를 만듭니다.
 */
export const calendarEventToBowelRecord = (
  event: Omit<CalendarEvent, "id" | "created_at">
): Omit<BowelRecord, "id" | "created_at" | "record_date" | "day_index"> => {
  // 제목에서 시간 추출 (예: "배변 성공 (HH:MM) - 많음")
  const timeMatch = event.title.match(/\((\d{2}:\d{2})\)/);
  const timeString = timeMatch ? timeMatch[1] : "09:00"; // 기본값 9시

  // 한국 날짜+시간을 UTC로 변환 (데이터베이스에 UTC로 저장)
  const utcDateTime = koreanDateTimeToUTC(event.date, timeString);

  // UTC 시간을 Date 객체로 변환
  const startTime = new Date(utcDateTime);

  // 제목에서 성공/실패 여부 추출
  const success = event.title.includes("성공");

  // 제목에서 배변량 추출
  let amount = null;
  if (success) {
    const amountMatch = event.title.match(/- (많음|보통|적음|이상)/);
    amount = amountMatch ? amountMatch[1] : "보통";
  }

  // 소요 시간 추출 (기본값 5분)
  let duration = 5;
  const durationMatch = event.description.match(/소요 시간: (\d+)분/);
  if (durationMatch && durationMatch[1]) {
    duration = parseInt(durationMatch[1], 10);
  }

  // 종료 시간 계산 (시작 시간 + 소요 시간)
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

  // 메모 추출
  let memo = null;
  const memoMatch = event.description.match(/메모: (.+)/);
  if (memoMatch && memoMatch[1]) {
    memo = memoMatch[1];
  }

  // 결과 객체 생성 (시간을 UTC ISO 형식으로 저장)
  const result: any = {
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    duration: duration,
    success: success,
    amount: amount,
    memo: memo,
  };

  // user_id가 있는 경우에만 포함하여 호출자가 설정할 수 있게 함
  if (event.user_id) {
    result.user_id = event.user_id;
  }

  return result;
};
