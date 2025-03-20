import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 시간대를 기본값으로 설정
dayjs.tz.setDefault("Asia/Seoul");

// 한국 시간대 상수
export const KOREA_TIMEZONE = "Asia/Seoul";

/**
 * UTC 시간을 한국 시간으로 변환합니다.
 * @param utcTime UTC 기준 시간 문자열
 * @param format 반환할 날짜 형식 (기본값: YYYY-MM-DD HH:mm:ss)
 * @returns 한국 시간으로 변환된 문자열
 */
export const toKoreanTime = (
  utcTime: string | Date,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  // UTC 시간으로 명시적으로 파싱한 후 한국 시간대로 변환
  return dayjs.utc(utcTime).tz(KOREA_TIMEZONE).format(format);
};

/**
 * 한국 시간을 UTC로 변환합니다.
 * @param koreanTime 한국 시간 문자열 (YYYY-MM-DD HH:mm:ss 형식)
 * @param format 반환할 형식 (기본값: ISO 문자열)
 * @returns UTC 기준 ISO 문자열
 */
export const toUTCTime = (
  koreanTime: string | Date,
  format?: string
): string => {
  // 한국 시간대로 명시적으로 파싱
  const dt = dayjs.tz(koreanTime, KOREA_TIMEZONE);
  return format ? dt.utc().format(format) : dt.utc().toISOString();
};

/**
 * 한국 날짜와 시간을 조합하여 UTC ISO 문자열로 변환합니다.
 * @param date 날짜 문자열 (YYYY-MM-DD 형식)
 * @param time 시간 문자열 (HH:mm 형식)
 * @returns UTC 기준 ISO 문자열
 */
export const koreanDateTimeToUTC = (date: string, time: string): string => {
  const koreanDateTime = `${date}T${time}:00`;
  console.log("한국 시간대 날짜/시간 문자열:", koreanDateTime);
  return dayjs.tz(koreanDateTime, KOREA_TIMEZONE).utc().toISOString();
};

/**
 * 현재 한국 시간을 가져옵니다.
 * @param format 반환할 날짜 형식 (기본값: YYYY-MM-DD HH:mm:ss)
 * @returns 현재 한국 시간 문자열
 */
export const getCurrentKoreanTime = (
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  return dayjs().tz(KOREA_TIMEZONE).format(format);
};

/**
 * 핵심 날짜 변환 함수 - 앱 전체에서 일관되게 사용해야 함
 * UTC 시간을 한국 날짜로 변환 (YYYY-MM-DD 형식)
 * @param utcTime UTC 기준 시간 문자열
 * @returns 한국 날짜 (YYYY-MM-DD 형식)
 */
export const getKoreanDate = (utcTime: string | Date): string => {
  // 가장 안전한 접근법: Date 객체로 변환 후 9시간 더하기
  const date = new Date(utcTime);
  // UTC+9 시간으로 명시적 변환
  const koreanDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  // ISO 문자열로 변환 후 날짜 부분만 추출 (YYYY-MM-DD)
  return koreanDate.toISOString().split("T")[0];
};

/**
 * UTC 시간을 한국 시간으로 변환합니다 (시간만 변환).
 * @param utcTime UTC 시간
 * @returns 한국 시간 (HH:mm 형식)
 */
export const getKoreanTime = (utcTime: string | Date): string => {
  return dayjs.utc(utcTime).tz(KOREA_TIMEZONE).format("HH:mm");
};

/**
 * 시스템 타임존 정보를 반환합니다. (디버깅용)
 */
export const getTimezoneInfo = (): Record<string, any> => {
  return {
    systemTimezone: dayjs.tz.guess(),
    koreaTzOffset: dayjs().tz(KOREA_TIMEZONE).utcOffset(),
    browserTzOffset: new Date().getTimezoneOffset() * -1,
    currentLocalTime: new Date().toString(),
    currentKoreanTime: getCurrentKoreanTime(),
    currentUTCTime: dayjs().utc().format(),
  };
};

/**
 * 배변 기록의 record_date 계산 함수 (표준화된 방식으로 일관되게 사용)
 * @param startTime 배변 시작 시간 (UTC)
 * @returns 한국 날짜 (YYYY-MM-DD)
 */
export const calculateRecordDate = (startTime: string | Date): string => {
  return getKoreanDate(startTime);
};
