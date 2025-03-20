import { supabase } from "../lib/supabase";
import { BowelRecord, CalendarEvent, ServiceResponse } from "../types";
import { getCurrentUser } from "./auth";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { calculateRecordDate } from "../utils/dateHelpers";
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

      // 중요: 한국 시간을 그대로 저장하되, ISO 문자열로 변환
      // 이전 문제: UTC 변환으로 -9시간 적용되어 시간이 틀림
      const startTimeIso = koreaDateTime.toISOString();
      console.log("[BowelRecordService] 저장할 ISO 시간:", startTimeIso);
      console.log(
        "[BowelRecordService] 변환 확인:",
        dayjs(startTimeIso).tz(KOREA_TIMEZONE).format()
      );

      // 종료 시간 계산 (duration 분 후)
      const endDateTime = koreaDateTime.add(duration, "minute");
      const endTimeIso = endDateTime.toISOString();

      // ===== 날짜 처리 로직 개선 =====
      // 1. 사용자가 선택한 날짜
      const userSelectedDate = date;

      // 2. 표준 함수를 사용하여 시작 시간의 한국 날짜 계산
      const actualKoreanDate = calculateRecordDate(startTimeIso);

      // 3. 로그 기록 - 날짜 정보 비교
      console.log("[BowelRecordService] 사용자 선택 날짜:", userSelectedDate);
      console.log(
        "[BowelRecordService] 실제 시작 시간의 한국 날짜:",
        actualKoreanDate
      );

      // 4. 저장용 record_date 설정 - 항상 계산된 실제 한국 날짜 사용
      const recordDate = actualKoreanDate;

      // 5. 날짜 불일치 경고 및 처리
      let dateWarning = null;
      if (userSelectedDate !== recordDate) {
        dateWarning = `선택하신 날짜(${userSelectedDate})와 달리, 입력한 시간에 따라 실제 기록은 ${recordDate}에 표시됩니다.`;
        console.warn(`[BowelRecordService] 날짜 불일치 감지: ${dateWarning}`);
      }

      // 고유한 day_index 값 조회 (같은 날짜에 중복되지 않도록)
      const { data: existingRecords, error: fetchError } = await supabase
        .from("bowel_records")
        .select("day_index")
        .eq("user_id", currentUser.id)
        .eq("record_date", recordDate)
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

      // 레코드 데이터 생성 - 계산된 한국 날짜 사용
      const recordData = {
        user_id: currentUser.id,
        record_date: recordDate,
        start_time: startTimeIso,
        end_time: endTimeIso,
        duration,
        success: isSuccess,
        amount: isSuccess ? amount : null,
        memo: memo || null,
        day_index: dayIndex,
        date_warning: dateWarning, // 날짜 불일치 경고 저장 (UI에서 표시 가능)
      };

      console.log("[BowelRecordService] 저장할 데이터:", recordData);
      console.log("[BowelRecordService] record_date:", recordData.record_date);
      console.log(
        "[BowelRecordService] start_time:",
        startTimeIso,
        "->",
        getKoreanDate(startTimeIso)
      );

      // date_warning 필드가 없다면 제거 (DB 스키마에 없을 경우)
      if (recordData.date_warning === null) {
        // date_warning이 null이면 객체에서 필드 자체를 제거
        const recordDataForDB = { ...recordData };
        delete (recordDataForDB as any).date_warning;

        // DB에 저장할 때는 date_warning 없이 저장
        const { data, error } = await supabase
          .from("bowel_records")
          .insert([recordDataForDB])
          .select("*")
          .single();

        if (error) throw error;

        // 반환할 때는 date_warning 추가
        const responseData = {
          ...data,
          date_warning: dateWarning,
        };

        console.log("[BowelRecordService] 저장 성공:", data);
        console.log(
          "[BowelRecordService] 저장된 record_date:",
          data.record_date
        );
        console.log(
          "[BowelRecordService] 저장된 start_time:",
          data.start_time,
          "->",
          getKoreanDate(data.start_time)
        );

        return { data: responseData as BowelRecord, error: null };
      } else {
        // date_warning이 있는 경우 그대로 저장 (DB 스키마에 해당 필드가 있을 경우)
        const { data, error } = await supabase
          .from("bowel_records")
          .insert([recordData])
          .select("*")
          .single();

        if (error) throw error;

        console.log("[BowelRecordService] 저장 성공:", data);
        console.log(
          "[BowelRecordService] 저장된 record_date:",
          data.record_date
        );
        console.log(
          "[BowelRecordService] 저장된 start_time:",
          data.start_time,
          "->",
          getKoreanDate(data.start_time)
        );

        // 반환 데이터에 날짜 경고 추가
        const responseData = {
          ...data,
          date_warning: dateWarning,
        };

        return { data: responseData as BowelRecord, error: null };
      }
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

  /**
   * 특정 날짜 범위의 배변 기록을 조회합니다
   * @param startDate 시작 날짜 (YYYY-MM-DD)
   * @param endDate 종료 날짜 (YYYY-MM-DD)
   */
  static async getRecordsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ServiceResponse<BowelRecord[]>> {
    try {
      console.log(
        `[BowelRecordService] ${startDate} ~ ${endDate} 기간 기록 조회 요청`
      );

      const { data, error } = await supabase
        .from("bowel_records")
        .select("*")
        .gte("record_date", startDate)
        .lte("record_date", endDate)
        .order("record_date", { ascending: true })
        .order("day_index", { ascending: true });

      if (error) throw error;

      console.log(
        `[BowelRecordService] ${startDate} ~ ${endDate} 기간 기록 ${
          data?.length || 0
        }개 조회됨`
      );
      return { data: data as BowelRecord[], error: null };
    } catch (error) {
      console.error(
        `[BowelRecordService] ${startDate} ~ ${endDate} 기간 기록 조회 중 오류:`,
        error
      );
      return { data: null, error: error as Error };
    }
  }

  /**
   * 특정 월의 배변 성공 횟수를 계산합니다
   * @param year 연도 (예: 2025)
   * @param month 월 (1-12)
   */
  static async getMonthlySuccessCount(
    year: number,
    month: number
  ): Promise<ServiceResponse<number>> {
    try {
      // 월의 시작일과 마지막일 계산
      const startDate = dayjs()
        .year(year)
        .month(month - 1)
        .date(1)
        .format("YYYY-MM-DD");

      const endDate = dayjs()
        .year(year)
        .month(month - 1)
        .endOf("month")
        .format("YYYY-MM-DD");

      console.log(
        `[BowelRecordService] ${year}년 ${month}월 성공 기록 조회 (${startDate} ~ ${endDate})`
      );

      // 해당 월에 성공한 기록 조회
      const { data: records, error } = await supabase
        .from("bowel_records")
        .select("id")
        .gte("record_date", startDate)
        .lte("record_date", endDate)
        .eq("success", true);

      if (error) throw error;

      const successCount = records?.length || 0;
      console.log(
        `[BowelRecordService] ${year}년 ${month}월 성공 횟수: ${successCount}회`
      );

      return { data: successCount, error: null };
    } catch (error) {
      console.error(
        `[BowelRecordService] ${year}년 ${month}월 성공 횟수 조회 중 오류:`,
        error
      );
      return { data: null, error: error as Error };
    }
  }
}
