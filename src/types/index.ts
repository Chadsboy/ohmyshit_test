import { PostgrestError } from "@supabase/supabase-js";

// 이벤트 타입 정의
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 형식 날짜 (YYYY-MM-DD)
  created_at?: string;
  user_id?: string | null;
}

// 배변 기록 타입 정의
export interface BowelRecord {
  id: string;
  user_id: string;
  start_time: string; // ISO 형식 타임스탬프
  end_time: string; // ISO 형식 타임스탬프
  duration: number; // 분 단위
  success: boolean;
  amount: "많음" | "보통" | "적음" | "이상" | null;
  memo: string | null;
  created_at: string;
  record_date: string; // ISO 형식 날짜 (YYYY-MM-DD)
  day_index: number;
}

// 서비스 응답 타입 정의
export interface ServiceResponse<T> {
  data: T | null;
  error: PostgrestError | Error | null;
}

// 네비게이션 아이템 타입
export interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  value: string;
}

// 캐릭터 컴포넌트 프롭스 타입
export interface CharacterProps {
  image: string;
  animation?: "bounce" | "wave" | "none";
  size?: "small" | "medium" | "large";
}

// 데이터베이스 타입 정의
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          created_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          created_at?: string;
          user_id?: string | null;
        };
      };
      bowel_records: {
        Row: {
          id: string;
          user_id: string;
          start_time: string;
          end_time: string;
          duration: number;
          success: boolean;
          amount: string | null;
          memo: string | null;
          created_at: string;
          record_date: string;
          day_index: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_time: string;
          end_time: string;
          duration: number;
          success: boolean;
          amount?: string | null;
          memo?: string | null;
          created_at?: string;
          record_date?: string;
          day_index?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          start_time?: string;
          end_time?: string;
          duration?: number;
          success?: boolean;
          amount?: string | null;
          memo?: string | null;
          created_at?: string;
          record_date?: string;
          day_index?: number;
        };
      };
    };
  };
}
