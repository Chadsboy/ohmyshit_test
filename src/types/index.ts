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
  date_warning?: string | null; // 프론트엔드에서 사용하는 날짜 경고 메시지
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

// Article 인터페이스 추가
export interface Article {
  id: number;
  category: string;
  title: string;
  content: string;
  date: string; // ISO 형식 문자열로 저장된 날짜
  views: number;
  created_at?: string;
  updated_at?: string;
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
      articles: {
        Row: {
          id: number;
          category: string;
          title: string;
          content: string;
          date: string;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          category: string;
          title: string;
          content: string;
          date?: string;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          category?: string;
          title?: string;
          content?: string;
          date?: string;
          views?: number;
          created_at?: string;
          updated_at?: string;
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
