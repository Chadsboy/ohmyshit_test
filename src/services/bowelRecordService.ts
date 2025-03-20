import { supabase } from "../lib/supabase";
import { BowelRecord, CalendarEvent, ServiceResponse } from "../types";
import { getCurrentUser } from "./auth";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getKoreanDate } from "../utils/dateHelpers";

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 시간대
const KOREA_TIMEZONE = "Asia/Seoul";

/**
 * 배변 기록 서비스
 * 타임존 문제를 해결하면서 배변 기록을 관리하는 전용 서비스
 */
export class BowelRecordService {
  /**
   * 새로운 배변 기록을 생성합니다
   * @param date 사용자가 선택한 날짜 (YYYY-MM-DD)
   * @param time 시간 (24시간제, HH:MM 형식)
   * @param duration 소요 시간 (분)
   * @param isSuccess 성공 여부
   * @param amount 배변량 (성공인 경우)
   * @param memo 메모
   */
  static async createRecord(
    date: string,
    time: string = "09:00",
    duration: number = 5,
    isSuccess: boolean = true,
    amount: string | null = null,
    memo: string | null = null
  ): Promise<ServiceResponse<BowelRecord>> {
    try {
      // 현재 사용자 정보 가져오기
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("사용자 인증 정보를 찾을 수 없습니다.");
      }

      console.log("[BowelRecordService] 입력된 날짜/시간:", date, time);

      // 한국 시간 기준으로 날짜와 시간 조합
      const koreaDateTime = dayjs.tz(`${date}T${time}:00`, KOREA_TIMEZONE);
      console.log(
        "[BowelRecordService] 한국 시간 객체:",
        koreaDateTime.format()
      );

      // UTC 시간으로 변환 (데이터베이스 저장용)
      const utcDateTime = koreaDateTime.utc();
      console.log("[BowelRecordService] UTC 시간 객체:", utcDateTime.format());

      // 종료 시간 계산 (duration 분 후)
      const endDateTime = utcDateTime.add(duration, "minute");

      // ISO 문자열로 변환
      const startTimeIso = utcDateTime.toISOString();
      const endTimeIso = endDateTime.toISOString();

      // 사용자가 선택한 날짜와 UTC 변환 후 한국 날짜 비교
      const userSelectedDate = date;

      // 한국 로케일을 사용하여 날짜 변환
      const startDate = new Date(startTimeIso);
      // 9시간(UTC+9) 추가
      startDate.setHours(startDate.getHours() + 9);

      // 한국 로케일로 날짜 형식 변환 (YYYY. MM. DD. 형식으로 반환)
      const koDateStr = startDate.toLocaleDateString("ko-KR");

      // YYYY-MM-DD 형식으로 변환
      const dateParts = koDateStr.split(". ");
      const actualKoreanDate =
        dateParts[0] +
        "-" +
        dateParts[1].padStart(2, "0") +
        "-" +
        dateParts[2].padStart(2, "0");

      console.log("[BowelRecordService] 사용자 선택 날짜:", userSelectedDate);
      console.log("[BowelRecordService] 한국 로케일 날짜:", koDateStr);
      console.log(
        "[BowelRecordService] 실제 시작 시간의 한국 날짜:",
        actualKoreanDate
      );

      // 언제나 실제 한국 날짜를 record_date로 사용 (이게 중요!)
      const koreanDate = actualKoreanDate;

      // 날짜 불일치 확인 및 로그 기록
      if (userSelectedDate !== koreanDate) {
        console.warn(
          `[BowelRecordService] 날짜 변경됨: 사용자 선택 날짜(${userSelectedDate})와 달리, 시작 시간의 한국 날짜(${koreanDate})를 record_date로 사용합니다.`
        );
      }

      // 고유한 day_index 값 조회 (같은 날짜에 중복되지 않도록)
      const { data: existingRecords, error: fetchError } = await supabase
        .from("bowel_records")
        .select("day_index")
        .eq("user_id", currentUser.id)
        .eq("record_date", koreanDate)
        .order("day_index", { ascending: false });

      if (fetchError) {
        console.error(
          "[BowelRecordService] 기존 인덱스 조회 중 오류:",
          fetchError
        );
        throw fetchError;
      }

      // 해당 날짜의 최대 day_index 계산 (없으면 1, 있으면 최대값 + 1)
      let dayIndex = 1;
      if (existingRecords && existingRecords.length > 0) {
        const maxDayIndex = Math.max(
          ...existingRecords.map((r) => r.day_index || 0)
        );
        dayIndex = maxDayIndex + 1;
        console.log(
          `[BowelRecordService] 기존 최대 day_index: ${maxDayIndex}, 새 day_index: ${dayIndex}`
        );
      } else {
        console.log(
          `[BowelRecordService] 해당 날짜에 기존 레코드 없음, day_index: ${dayIndex} 사용`
        );
      }

      // 레코드 데이터 생성 - 사용자가 선택한 날짜 사용
      const recordData = {
        user_id: currentUser.id,
        record_date: koreanDate,
        start_time: startTimeIso,
        end_time: endTimeIso,
        duration,
        success: isSuccess,
        amount: isSuccess ? amount : null,
        memo: memo || null,
        day_index: dayIndex,
      };

      console.log("[BowelRecordService] 저장할 데이터:", recordData);
      console.log("[BowelRecordService] record_date:", recordData.record_date);
      console.log(
        "[BowelRecordService] start_time:",
        startTimeIso,
        "->",
        getKoreanDate(startTimeIso)
      );

      // 데이터베이스에 저장
      const { data, error } = await supabase
        .from("bowel_records")
        .insert([recordData])
        .select("*")
        .single();

      if (error) throw error;

      console.log("[BowelRecordService] 저장 성공:", data);
      console.log("[BowelRecordService] 저장된 record_date:", data.record_date);
      console.log(
        "[BowelRecordService] 저장된 start_time:",
        data.start_time,
        "->",
        getKoreanDate(data.start_time)
      );

      return { data: data as BowelRecord, error: null };
    } catch (error) {
      console.error("[BowelRecordService] 배변 기록 생성 중 오류:", error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 특정 날짜의 배변 기록을 조회합니다
   * @param date 조회할 날짜 (YYYY-MM-DD)
   */
  static async getRecordsByDate(
    date: string
  ): Promise<ServiceResponse<BowelRecord[]>> {
    try {
      console.log(`[BowelRecordService] ${date} 날짜 기록 조회 요청`);

      // record_date 필드를 사용하여 해당 날짜의 기록만 조회
      const { data, error } = await supabase
        .from("bowel_records")
        .select("*")
        .eq("record_date", date)
        .order("start_time", { ascending: true });

      if (error) throw error;

      console.log(
        `[BowelRecordService] ${date} 날짜 기록 ${data?.length || 0}개 조회됨`
      );

      // 조회 결과 반환
      return { data: data as BowelRecord[], error: null };
    } catch (error) {
      console.error(
        `[BowelRecordService] ${date} 날짜 기록 조회 중 오류:`,
        error
      );
      return { data: null, error: error as Error };
    }
  }

  /**
   * 배변 기록을 캘린더 이벤트로 변환합니다
   * @param record 변환할 배변 기록
   */
  static recordToCalendarEvent(record: BowelRecord): CalendarEvent {
    // UTC 시간을 한국 시간으로 변환
    const startTimeKST = dayjs(record.start_time).tz(KOREA_TIMEZONE);

    // record_date를 그대로 사용 (이미 올바른 한국 날짜)
    const dateForEvent = record.record_date;

    // 한국 시간 문자열 (HH:MM)
    const timeStr = startTimeKST.format("HH:mm");

    console.log(`[BowelRecordService] UTC 시간: ${record.start_time}`);
    console.log(
      `[BowelRecordService] 변환된 한국 시간: ${startTimeKST.format()}`
    );
    console.log(`[BowelRecordService] 이벤트에 사용되는 날짜: ${dateForEvent}`);
    console.log(`[BowelRecordService] record_date: ${record.record_date}`);

    if (!record.record_date) {
      console.error(
        "[심각한 오류] record_date가 없습니다! 기록 ID:",
        record.id
      );
    }

    // 성공/실패 상태와 배변량에 따라 제목 생성
    let title = record.success
      ? `배변 성공 (${timeStr})`
      : `배변 시도 (${timeStr})`;

    if (record.success && record.amount) {
      title += ` - ${record.amount}`;
    }

    // 설명 생성
    let description = `소요 시간: ${record.duration}분`;
    if (record.memo) {
      description += `\n메모: ${record.memo}`;
    }

    // 캘린더 이벤트 객체 생성 - 항상 record_date 필드를 사용
    return {
      id: record.id,
      title,
      description,
      date: dateForEvent,
      created_at: record.created_at,
      user_id: record.user_id,
    };
  }

  /**
   * 배변 기록 배열을 캘린더 이벤트 배열로 변환합니다
   * @param records 변환할 배변 기록 배열
   */
  static recordsToCalendarEvents(records: BowelRecord[]): CalendarEvent[] {
    return records.map(this.recordToCalendarEvent);
  }

  /**
   * 배변 기록을 삭제합니다
   * @param id 삭제할 기록 ID
   */
  static async deleteRecord(id: string): Promise<ServiceResponse<null>> {
    try {
      const { error } = await supabase
        .from("bowel_records")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return { data: null, error: null };
    } catch (error) {
      console.error(`[BowelRecordService] ID ${id} 기록 삭제 중 오류:`, error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 배변 기록을 업데이트합니다
   * @param id 업데이트할 기록 ID
   * @param updates 업데이트할 필드들
   */
  static async updateRecord(
    id: string,
    updates: {
      date?: string;
      memo?: string;
      amount?: string | null;
      success?: boolean;
    }
  ): Promise<ServiceResponse<BowelRecord>> {
    try {
      const updateData: any = {};

      if (updates.date) {
        // 날짜 업데이트 시 명시적으로 YYYY-MM-DD 형식 사용
        updateData.record_date = updates.date;
        console.log(
          `[BowelRecordService] 업데이트할 record_date: ${updates.date}`
        );

        // 필요시 해당 날짜의 레코드를 가져와서 start_time의 시간 부분만 유지하고
        // 날짜 부분은 사용자가 선택한 날짜로 업데이트하는 로직을 추가할 수 있습니다.
      }

      if (updates.memo !== undefined) {
        updateData.memo = updates.memo;
      }

      if (updates.amount !== undefined) {
        updateData.amount = updates.amount;
      }

      if (updates.success !== undefined) {
        updateData.success = updates.success;
      }

      // 업데이트 데이터가 비어있으면 에러
      if (Object.keys(updateData).length === 0) {
        throw new Error("업데이트할 데이터가 없습니다.");
      }

      console.log(`[BowelRecordService] ID ${id} 업데이트 데이터:`, updateData);

      const { data, error } = await supabase
        .from("bowel_records")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;

      console.log(`[BowelRecordService] ID ${id} 업데이트 완료:`, data);

      return { data: data as BowelRecord, error: null };
    } catch (error) {
      console.error(`[BowelRecordService] ID ${id} 업데이트 중 오류:`, error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 모든 기록의 record_date 필드를 한국 시간 기준으로 업데이트합니다.
   * 주의: 이 함수는 관리자 기능으로, 필요한 경우에만 사용해야 합니다.
   */
  static async updateAllRecordDates(): Promise<
    ServiceResponse<{ updated: number; failed: number }>
  > {
    try {
      // 모든 기록 가져오기
      const { data, error } = await supabase
        .from("bowel_records")
        .select("id, start_time, record_date");

      if (error) throw error;

      if (!data || data.length === 0) {
        return { data: { updated: 0, failed: 0 }, error: null };
      }

      let updatedCount = 0;
      let failedCount = 0;

      // 각 기록 처리
      for (const record of data) {
        try {
          // UTC 시간을 한국 시간으로 변환하여 날짜 추출
          const koreanDate = dayjs
            .utc(record.start_time)
            .tz(KOREA_TIMEZONE)
            .format("YYYY-MM-DD");

          // 날짜가 다른 경우에만 업데이트
          if (record.record_date !== koreanDate) {
            // 현재 타임스탬프와 임의의 값으로 고유한 인덱스 생성
            const randomIndex =
              (Date.now() % 10000) + Math.floor(Math.random() * 1000);

            const { error: updateError } = await supabase
              .from("bowel_records")
              .update({
                record_date: koreanDate,
                day_index: randomIndex, // 고유한 인덱스 값 설정
              })
              .eq("id", record.id);

            if (updateError) {
              failedCount++;
            } else {
              updatedCount++;
            }
          }
        } catch (err) {
          failedCount++;
        }
      }

      return {
        data: { updated: updatedCount, failed: failedCount },
        error: null,
      };
    } catch (error) {
      console.error("[BowelRecordService] 기록 날짜 업데이트 중 오류:", error);
      return { data: null, error: error as Error };
    }
  }
}
