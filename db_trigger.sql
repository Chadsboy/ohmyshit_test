-- 배변 기록 타임존 처리를 위한 데이터베이스 트리거
-- Supabase SQL Editor에서 실행해야 합니다

-- 날짜 변환 함수 생성
CREATE OR REPLACE FUNCTION public.get_korean_date_from_timestamp(timestamp_value TIMESTAMPTZ)
RETURNS DATE AS $$
BEGIN
  RETURN (timestamp_value AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::date;
END;
$$ LANGUAGE plpgsql;

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.set_correct_record_date()
RETURNS TRIGGER AS $$
BEGIN
  -- start_time을 한국 시간대 날짜로 변환
  NEW.record_date = public.get_korean_date_from_timestamp(NEW.start_time);
  
  -- 로그 출력 (디버깅용)
  RAISE NOTICE 'Record date changed: % from % to %', 
    NEW.id, 
    COALESCE(NEW.record_date::text, 'NULL'), 
    public.get_korean_date_from_timestamp(NEW.start_time)::text;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 삽입 및 업데이트 시 트리거 생성 (이미 존재하면 DROP)
DROP TRIGGER IF EXISTS ensure_correct_record_date ON public.bowel_records;

CREATE TRIGGER ensure_correct_record_date
BEFORE INSERT OR UPDATE ON public.bowel_records
FOR EACH ROW EXECUTE FUNCTION public.set_correct_record_date();

-- 기존 레코드 업데이트 (필요시 실행)
UPDATE public.bowel_records
SET record_date = public.get_korean_date_from_timestamp(start_time); 