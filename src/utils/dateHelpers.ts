import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

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
  return dayjs(utcTime).tz(KOREA_TIMEZONE).format(format);
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
