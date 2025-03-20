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
  // 시간대 변환 문제 해결을 위한 접근법
  try {
    // 1. 입력값이 Date 객체인 경우 ISO 문자열로 변환
    const isoString = utcTime instanceof Date ? utcTime.toISOString() : utcTime;

    // 2. 디버깅을 위한 로그
    console.log("[getKoreanDate] 입력된 시간:", isoString);
    const parsedInUTC = dayjs.utc(isoString);
    console.log("[getKoreanDate] UTC로 파싱:", parsedInUTC.format());

    // 3. UTC 시간을 한국 시간으로 변환
    const koreanDateTime = parsedInUTC.tz(KOREA_TIMEZONE);
    console.log("[getKoreanDate] 한국 시간으로 변환:", koreanDateTime.format());

    // 4. YYYY-MM-DD 형식으로 반환
    const result = koreanDateTime.format("YYYY-MM-DD");
    console.log("[getKoreanDate] 최종 날짜:", result);

    return result;
  } catch (error) {
    console.error("[getKoreanDate] 날짜 변환 오류:", error);
    console.error("[getKoreanDate] 입력값:", utcTime);

    // 오류가 발생하면 기존 방식으로 변환 시도 (fallback)
    try {
      const date = new Date(utcTime);
      // 한국은 UTC+9이므로 9시간 더함
      const koreanDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      const result = koreanDate.toISOString().split("T")[0];
      console.log("[getKoreanDate] 대체 방식으로 계산된 날짜:", result);
      return result;
    } catch (fallbackError) {
      console.error("[getKoreanDate] 대체 방식도 실패:", fallbackError);
      // 최종 fallback - 현재 날짜 반환
      return dayjs().format("YYYY-MM-DD");
    }
  }
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
