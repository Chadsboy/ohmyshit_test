import { supabase } from "../lib/supabase";
import { BowelRecord, ServiceResponse } from "../types";

// 새로운 배변 기록 생성
export const createBowelRecord = async (
  data: Omit<BowelRecord, "id" | "created_at" | "record_date" | "day_index">
): Promise<ServiceResponse<BowelRecord>> => {
  try {
    const { data: record, error } = await supabase
      .from("bowel_records")
      .insert([data])
      .select("*")
      .single();

    if (error) throw error;

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
