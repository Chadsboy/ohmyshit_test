import { supabase } from "../lib/supabase";
import { BowelRecord, ServiceResponse } from "../types";
import { calculateRecordDate } from "../utils/dateHelpers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 시간대
const KOREA_TIMEZONE = "Asia/Seoul";

// 새로운 배변 기록 생성
export const createBowelRecord = async (
  data: Omit<BowelRecord, "id" | "created_at" | "record_date" | "day_index">
): Promise<ServiceResponse<BowelRecord>> => {
  try {
    // 타임존 처리: start_time을 한국 날짜로 변환하여 record_date로 설정
    console.log("[createBowelRecord] 원본 데이터:", data);

    // 표준 함수를 사용하여 한국 날짜 계산
    const koreanDate = calculateRecordDate(data.start_time);

    console.log(`[createBowelRecord] UTC 시작시간: ${data.start_time}`);
    console.log(`[createBowelRecord] 변환된 한국 날짜: ${koreanDate}`);

    // day_index 계산을 위해 기존 레코드 조회
    const { data: existingRecords, error: fetchError } = await supabase
      .from("bowel_records")
      .select("day_index")
      .eq("user_id", data.user_id)
      .eq("record_date", koreanDate)
      .order("day_index", { ascending: false });

    if (fetchError) {
      console.error(
        "[createBowelRecord] 기존 레코드 조회 중 오류:",
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
        `[createBowelRecord] 기존 최대 day_index: ${maxDayIndex}, 새 day_index: ${dayIndex}`
      );
    } else {
      console.log(
        `[createBowelRecord] 해당 날짜(${koreanDate})에 기존 레코드 없음, day_index: ${dayIndex} 사용`
      );
    }

    // record_date와 day_index 추가
    const completeData = {
      ...data,
      record_date: koreanDate,
      day_index: dayIndex,
    };

    console.log("[createBowelRecord] 최종 저장 데이터:", completeData);

    const { data: record, error } = await supabase
      .from("bowel_records")
      .insert([completeData])
      .select("*")
      .single();

    if (error) throw error;

    console.log("[createBowelRecord] 저장 성공:", record);
    console.log("[createBowelRecord] 저장된 record_date:", record.record_date);

    return { data: record, error: null };
  } catch (error) {
    console.error("배변 기록 생성 중 오류:", error);
    return { data: null, error: error as Error };
  }
};

// 특정 날짜의 배변 기록 조회
export const getBowelRecordsByDate = async (
  date: string // ISO 형식 날짜 (YYYY-MM-DD)
): Promise<ServiceResponse<BowelRecord[]>> => {
  try {
    const { data: records, error } = await supabase
      .from("bowel_records")
      .select("*")
      .eq("record_date", date)
      .order("day_index", { ascending: true });

    if (error) throw error;

    return { data: records, error: null };
  } catch (error) {
    console.error("배변 기록 조회 중 오류:", error);
    return { data: null, error: error as Error };
  }
};

// 특정 기간의 배변 기록 조회
export const getBowelRecordsByDateRange = async (
  startDate: string, // ISO 형식 날짜 (YYYY-MM-DD)
  endDate: string // ISO 형식 날짜 (YYYY-MM-DD)
): Promise<ServiceResponse<BowelRecord[]>> => {
  try {
    const { data: records, error } = await supabase
      .from("bowel_records")
      .select("*")
      .gte("record_date", startDate)
      .lte("record_date", endDate)
      .order("record_date", { ascending: true })
      .order("day_index", { ascending: true });

    if (error) throw error;

    return { data: records, error: null };
  } catch (error) {
    console.error("배변 기록 조회 중 오류:", error);
    return { data: null, error: error as Error };
  }
};

// 배변 기록 수정
export const updateBowelRecord = async (
  id: string,
  data: Partial<
    Omit<BowelRecord, "id" | "created_at" | "record_date" | "day_index">
  >
): Promise<ServiceResponse<BowelRecord>> => {
  try {
    const { data: record, error } = await supabase
      .from("bowel_records")
      .update(data)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return { data: record, error: null };
  } catch (error) {
    console.error("배변 기록 수정 중 오류:", error);
    return { data: null, error: error as Error };
  }
};

// 배변 기록 삭제
export const deleteBowelRecord = async (
  id: string
): Promise<ServiceResponse<null>> => {
  try {
    const { error } = await supabase
      .from("bowel_records")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { data: null, error: null };
  } catch (error) {
    console.error("배변 기록 삭제 중 오류:", error);
    return { data: null, error: error as Error };
  }
};

// 특정 월의 배변 성공 횟수 계산
export const getMonthlySuccessCount = async (
  year: number,
  month: number
): Promise<ServiceResponse<number>> => {
  try {
    const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    const { data: records, error } = await supabase
      .from("bowel_records")
      .select("*")
      .gte("record_date", startDate)
      .lte("record_date", endDate)
      .eq("success", true);

    if (error) throw error;

    return { data: records?.length || 0, error: null };
  } catch (error) {
    console.error("월간 성공 횟수 조회 중 오류:", error);
    return { data: null, error: error as Error };
  }
};
