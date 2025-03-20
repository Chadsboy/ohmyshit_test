-- 모든 기존 배변 기록의 record_date를 한국 날짜로 수정하는 스크립트
-- Supabase SQL 에디터에서 실행해주세요

-- 1. 기존 트리거 제거
DROP TRIGGER IF EXISTS ensure_correct_record_date ON public.bowel_records;
DROP TRIGGER IF EXISTS fix_bowel_record_date ON public.bowel_records;
DROP TRIGGER IF EXISTS ensure_korean_record_date ON public.bowel_records;
DROP TRIGGER IF EXISTS set_correct_record_date ON public.bowel_records;
DROP TRIGGER IF EXISTS set_bowel_record_date ON public.bowel_records;

-- 2. 기존 함수 제거
DROP FUNCTION IF EXISTS public.get_korean_date_from_timestamp;
DROP FUNCTION IF EXISTS public.fix_record_date;
DROP FUNCTION IF EXISTS public.set_correct_record_date;
DROP FUNCTION IF EXISTS public.ensure_korean_record_date;
DROP FUNCTION IF EXISTS public.set_bowel_record_date;

-- 3. 새로운 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.fix_bowel_record_date()
RETURNS TRIGGER AS $$
BEGIN
  -- start_time을 한국 시간대로 변환하여 날짜만 추출 (UTC+9)
  NEW.record_date = (NEW.start_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::date;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 새로운 트리거 생성
CREATE TRIGGER fix_bowel_record_date
BEFORE INSERT OR UPDATE ON public.bowel_records
FOR EACH ROW EXECUTE FUNCTION public.fix_bowel_record_date();

-- 5. 기존 데이터 모두 수정
UPDATE public.bowel_records
SET record_date = (start_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::date;

-- 6. 결과 확인
SELECT 
  id, 
  start_time, 
  record_date, 
  (start_time AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Seoul')::date as calculated_date
FROM public.bowel_records
ORDER BY start_time DESC
LIMIT 10; 