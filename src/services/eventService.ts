import { supabase } from "../lib/supabase";
import { CalendarEvent, ServiceResponse, BowelRecord } from "../types";
import { PostgrestError } from "@supabase/supabase-js";
import {
  bowelRecordToCalendarEvent,
  bowelRecordsToCalendarEvents,
  calendarEventToBowelRecord,
} from "../utils/dataAdapters";
import { getCurrentUser } from "./auth";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  toKoreanTime,
  KOREA_TIMEZONE,
  getKoreanDate,
} from "../utils/dateHelpers";

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 시간대 설정
dayjs.tz.setDefault(KOREA_TIMEZONE);

/**
 * 이벤트 서비스 클래스
 * bowel_records 테이블과 상호작용하고 CalendarEvent 형식으로 데이터를 반환합니다.
 */
export class EventService {
  /**
   * 모든 이벤트를 가져옵니다.
   */
  static async getAllEvents(): Promise<ServiceResponse<CalendarEvent[]>> {
    try {
      const { data, error } = await supabase
        .from("bowel_records")
        .select("*")
        .order("record_date", { ascending: true });

      if (error) throw error;

      // BowelRecord 배열을 CalendarEvent 배열로 변환
      const calendarEvents = bowelRecordsToCalendarEvents(
        data as BowelRecord[]
      );

      return { data: calendarEvents, error: null };
    } catch (error) {
      console.error("모든 이벤트 조회 중 오류:", error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 특정 날짜의 이벤트를 가져옵니다.
   * @param date ISO 형식 날짜 (YYYY-MM-DD)
   */
  static async getEventsByDate(
    date: string
  ): Promise<ServiceResponse<CalendarEvent[]>> {
    try {
      console.log(`[EventService] 요청된 날짜: ${date}`);

      // 해당 날짜의 모든 데이터 조회 (record_date 기준)
      const { data, error } = await supabase
        .from("bowel_records")
        .select("*")
        .eq("record_date", date)
        .order("start_time", { ascending: true });

      if (error) throw error;

      // 데이터가 이미 있다면 바로 반환
      if (data && data.length > 0) {
        console.log(
          `[EventService] ${date} 날짜에 ${data.length}개 이벤트 조회됨 (record_date 기준)`
        );

        // 조회된 데이터의 record_date 확인 (디버깅)
        data.forEach((record) => {
          console.log(
            `[EventService] 조회된 기록 ID: ${record.id}, record_date: ${record.record_date}, start_time: ${record.start_time}`
          );
        });

        // BowelRecord 배열을 CalendarEvent 배열로 변환
        const calendarEvents = bowelRecordsToCalendarEvents(
          data as BowelRecord[]
        );

        // 변환된 이벤트의 날짜 확인 (디버깅)
        calendarEvents.forEach((event) => {
          console.log(
            `[EventService] 변환된 이벤트 ID: ${event.id}, 날짜: ${event.date}, 제목: ${event.title}`
          );
        });

        return { data: calendarEvents, error: null };
      }

      console.log(
        `[EventService] ${date} 날짜에 record_date 기준 이벤트가 없습니다.`
      );

      // 추가 시도: 한국 시간 기준 해당 날짜의 시작과 끝을 UTC로 변환
      const startOfDay = dayjs
        .tz(`${date}T00:00:00`, KOREA_TIMEZONE)
        .utc()
        .toISOString();
      const endOfDay = dayjs
        .tz(`${date}T23:59:59`, KOREA_TIMEZONE)
        .utc()
        .toISOString();

      console.log(
        `[EventService] 시간 범위 조회 시도: ${startOfDay} ~ ${endOfDay}`
      );

      // 시간 범위로 이벤트 조회
      const { data: timeRangeData, error: timeRangeError } = await supabase
        .from("bowel_records")
        .select("*")
        .gte("start_time", startOfDay)
        .lte("start_time", endOfDay)
        .order("start_time", { ascending: true });

      if (timeRangeError) throw timeRangeError;

      console.log(
        `[EventService] 시간 범위 조회 결과: ${timeRangeData?.length}개 이벤트`
      );

      if (!timeRangeData || timeRangeData.length === 0) {
        return { data: [], error: null };
      }

      // 시간 범위로 찾은 기록들 확인
      timeRangeData.forEach((record) => {
        console.log(
          `[EventService] 시간 범위로 찾은 기록 ID: ${record.id}, record_date: ${record.record_date}, start_time: ${record.start_time}`
        );
        console.log(
          `[EventService] 한국 시간으로 변환: ${toKoreanTime(
            record.start_time
          )}`
        );
      });

      // 새로 찾은 이벤트들의 record_date 필드를 현재 날짜로 업데이트
      const updatePromises = timeRangeData.map(async (record) => {
        // 이미 해당 날짜의 record_date가 있는지 확인
        if (record.record_date !== date) {
          console.log(
            `[EventService] 기록 ID: ${record.id}의 record_date(${record.record_date})가 요청 날짜(${date})와 다릅니다. 업데이트 시도...`
          );

          const { error: updateError } = await supabase
            .from("bowel_records")
            .update({ record_date: date })
            .eq("id", record.id);

          if (updateError) {
            console.error(`ID ${record.id} 레코드 업데이트 실패:`, updateError);
          } else {
            console.log(
              `ID ${record.id} 레코드의 record_date를 ${date}로 업데이트함`
            );
            // 메모리상 객체도 업데이트
            record.record_date = date;
          }
        }
      });

      // 모든 업데이트 완료 대기
      await Promise.all(updatePromises);

      // BowelRecord 배열을 CalendarEvent 배열로 변환
      const calendarEvents = bowelRecordsToCalendarEvents(
        timeRangeData as BowelRecord[]
      );

      // 변환된 결과 로깅
      console.log(
        `[EventService] 최종 반환된 이벤트 날짜:`,
        calendarEvents.map((e) => e.date)
      );

      return { data: calendarEvents, error: null };
    } catch (error) {
      console.error(`${date} 날짜의 이벤트 조회 중 오류:`, error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 새 이벤트를 생성합니다.
   * @param event 생성할 이벤트 데이터
   */
  static async createEvent(
    event: Omit<CalendarEvent, "id" | "created_at">
  ): Promise<ServiceResponse<CalendarEvent>> {
    try {
      // 현재 사용자 정보 가져오기
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        throw new Error("사용자 인증 정보를 찾을 수 없습니다.");
      }

      // CalendarEvent를 BowelRecord 형식으로 변환
      const bowelData = calendarEventToBowelRecord(event);

      // user_id 설정
      bowelData.user_id = currentUser.id;

      // 날짜 필드 추가 (record_date) - 사용자가 선택한 날짜를 항상 우선 사용
      const recordDate = event.date;

      // 이벤트 생성 전 시간 정보 로깅
      const startTimeObj = new Date(bowelData.start_time);
      console.log(
        "[EventService] 저장되는 시작 시간 (ISO):",
        bowelData.start_time
      );
      console.log(
        "[EventService] 저장되는 시작 시간 (현지 문자열):",
        startTimeObj.toString()
      );
      console.log(
        "[EventService] 저장되는 시작 시간 (한국 시간):",
        toKoreanTime(bowelData.start_time)
      );
      console.log("[EventService] 사용자 선택 날짜:", recordDate);

      // 시작 시간에서 한국 날짜 추출 (한국 시간대로 변환하여 날짜만 가져옴)
      const koreanDateFromStartTime = getKoreanDate(bowelData.start_time);
      console.log(
        "[EventService] 시작 시간의 한국 날짜:",
        koreanDateFromStartTime
      );

      // 시간대 불일치 경고 출력
      if (recordDate !== koreanDateFromStartTime) {
        console.warn(
          `[EventService] 시간대 주의: 사용자 선택 날짜(${recordDate})와 start_time의 한국 날짜(${koreanDateFromStartTime})가 다릅니다. 시작 시간 기준 날짜를 사용합니다.`
        );
      }

      // 이벤트 데이터를 준비하고 record_date는 시작 시간의 한국 날짜로 설정
      const recordToInsert = {
        ...bowelData,
        record_date: koreanDateFromStartTime,
      };

      // 이벤트 데이터 저장
      const { data, error } = await supabase
        .from("bowel_records")
        .insert([recordToInsert])
        .select("*")
        .single();

      if (error) throw error;

      console.log("[EventService] 저장 후 데이터:", data);

      // 생성된 BowelRecord를 CalendarEvent로 변환
      const calendarEvent = bowelRecordToCalendarEvent(data as BowelRecord);

      return { data: calendarEvent, error: null };
    } catch (error) {
      console.error("이벤트 생성 중 오류:", error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 이벤트를 수정합니다.
   * @param id 수정할 이벤트 ID
   * @param event 수정할 이벤트 데이터
   */
  static async updateEvent(
    id: string,
    event: Partial<CalendarEvent>
  ): Promise<ServiceResponse<CalendarEvent>> {
    try {
      // 업데이트 데이터 준비
      const updateData: any = {};

      // 메모 업데이트
      if (event.description) {
        updateData.memo = event.description;
      }

      // 날짜 변경 시 record_date 필드 업데이트
      if (event.date) {
        updateData.record_date = event.date;

        // 날짜가 변경될 때 콘솔에 기록
        console.log(
          `[EventService] ID ${id} 이벤트 날짜를 ${event.date}로 업데이트`
        );
      }

      // 이벤트 업데이트 진행
      const { data, error } = await supabase
        .from("bowel_records")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;

      console.log("[EventService] 이벤트 업데이트 완료:", data);

      // 업데이트된 BowelRecord를 CalendarEvent로 변환
      const calendarEvent = bowelRecordToCalendarEvent(data as BowelRecord);

      return { data: calendarEvent, error: null };
    } catch (error) {
      console.error("이벤트 수정 중 오류:", error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 이벤트를 삭제합니다.
   * @param id 삭제할 이벤트 ID
   */
  static async deleteEvent(id: string): Promise<ServiceResponse<null>> {
    try {
      const { error } = await supabase
        .from("bowel_records")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return { data: null, error: null };
    } catch (error) {
      console.error("이벤트 삭제 중 오류:", error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 이벤트가 있는 날짜 목록을 가져옵니다.
   */
  static async getEventDates(): Promise<ServiceResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from("bowel_records")
        .select("record_date")
        .order("record_date", { ascending: true });

      if (error) throw error;

      // 중복 제거
      const uniqueDates = [
        ...new Set(data.map((item) => item.record_date as string)),
      ];

      return { data: uniqueDates, error: null };
    } catch (error) {
      console.error("이벤트 날짜 목록 조회 중 오류:", error);
      return { data: null, error: error as Error };
    }
  }
}
