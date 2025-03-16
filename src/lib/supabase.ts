import { createClient } from "@supabase/supabase-js";
import config from "../config";
import { Database } from "../types";

// 클라이언트 생성
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey
);

// 타입이 지정된 클라이언트 내보내기
export type SupabaseClient = typeof supabase;
