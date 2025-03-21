import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { supabase } from "../lib/supabaseClient";

interface BowelRecord {
  id: string;
  created_at: string;
  success: boolean;
  duration: number;
}

interface Statistics {
  mostFrequentTime: string;
  weeklyAverage: number;
  averageDuration: number;
  condition: "good" | "normal" | "bad";
  lastEventDate: string | null;
  conditionMessage: string;
  timeDistribution: { time: string; count: number }[];
}

const useStatistics = () => {
  const [statistics, setStatistics] = useState<Statistics>({
    mostFrequentTime: "",
    weeklyAverage: 0,
    averageDuration: 0,
    condition: "normal",
    lastEventDate: null,
    conditionMessage: "",
    timeDistribution: [],
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // 성공한 배변 기록만 가져오기
        const { data: records, error } = await supabase
          .from("bowel_records")
          .select("*")
          .eq("success", true);

        if (error) throw error;

        if (!records?.length) return;

        // 시간대별 분포 계산
        const timeMap = new Map<string, number>();
        records.forEach((record: BowelRecord) => {
          const time = dayjs(record.created_at).format("HH:mm");
          timeMap.set(time, (timeMap.get(time) || 0) + 1);
        });

        const timeDistribution = Array.from(timeMap.entries())
          .map(([time, count]) => ({ time, count }))
          .sort((a, b) => {
            const timeA = dayjs(a.time, "HH:mm");
            const timeB = dayjs(b.time, "HH:mm");
            return timeA.isBefore(timeB) ? -1 : 1;
          });

        // 가장 빈번한 시간 찾기
        const mostFrequent = Array.from(timeMap.entries()).sort(
          (a, b) => b[1] - a[1]
        )[0];
        const mostFrequentTime = mostFrequent ? mostFrequent[0] : "";

        // 주간 평균 계산
        const now = dayjs();
        const weekAgo = now.subtract(7, "day");
        const weeklyRecords = records.filter((record: BowelRecord) =>
          dayjs(record.created_at).isAfter(weekAgo)
        );
        const weeklyAverage = weeklyRecords.length;

        // 평균 소요 시간 계산
        const averageDuration = Math.round(
          records.reduce(
            (sum: number, record: BowelRecord) => sum + (record.duration || 0),
            0
          ) / records.length
        );

        // 컨디션 계산
        const lastRecord = records.sort(
          (a: BowelRecord, b: BowelRecord) =>
            dayjs(b.created_at).unix() - dayjs(a.created_at).unix()
        )[0];

        const lastEventDate = lastRecord?.created_at || null;
        const daysSinceLastEvent = lastEventDate
          ? now.diff(dayjs(lastEventDate), "day")
          : 0;

        let condition: "good" | "normal" | "bad" = "normal";
        let conditionMessage = "";

        if (daysSinceLastEvent <= 1) {
          condition = "good";
          conditionMessage = "정상적인 배변활동이 이루어지고 있습니다.";
        } else if (daysSinceLastEvent <= 3) {
          condition = "normal";
          conditionMessage = "배변활동이 다소 불규칙적입니다.";
        } else {
          condition = "bad";
          conditionMessage = `${daysSinceLastEvent}일 동안 배변활동이 없습니다.`;
        }

        setStatistics({
          mostFrequentTime,
          weeklyAverage,
          averageDuration,
          condition,
          lastEventDate,
          conditionMessage,
          timeDistribution,
        });
      } catch (error) {
        console.error("통계 데이터 조회 중 오류 발생:", error);
      }
    };

    fetchStatistics();
  }, []);

  return statistics;
};

export default useStatistics;
