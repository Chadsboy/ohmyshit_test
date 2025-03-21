import React, { useMemo } from "react";
import { Box, Card, Grid, Typography, useTheme } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { styled } from "@mui/material/styles";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
  height: "100%",
}));

const TitleWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

interface BowelTimeChartProps {
  data: { time: string; count: number }[];
  title?: string;
  subtitle?: string;
}

// 시간대 레이블 생성 (06:00부터 다음날 05:59까지)
const generateTimeLabels = () => {
  const labels = [];
  for (let i = 6; i < 30; i++) {
    const hour = i % 24;
    labels.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return labels;
};

const BowelTimeChart: React.FC<BowelTimeChartProps> = ({
  data,
  title = "My Best Sh!t Time",
  subtitle,
}) => {
  const theme = useTheme();

  // 시간대별 데이터 재구성 및 가장 빈번한 시간대 찾기
  const { processedData, mostFrequentTimeRange } = useMemo(() => {
    // 시간대별 카운트를 저장할 객체
    const hourlyCount: Record<number, number> = {};

    // 모든 시간대를 0으로 초기화 (06:00부터 다음날 05:59까지)
    for (let i = 0; i < 24; i++) {
      hourlyCount[i] = 0;
    }

    // 각 데이터의 시간대별 카운트 계산
    data.forEach((item) => {
      const time = dayjs(item.time, "HH:mm");
      let hour = time.hour();
      // 06:00 기준으로 시간 조정
      hour = (hour - 6 + 24) % 24;
      hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
    });

    // 가장 빈번한 시간대 찾기 (3시간 간격)
    let maxCount = 0;
    let maxStartHour = 0;
    for (let i = 0; i < 24; i += 3) {
      const rangeCount =
        hourlyCount[i] + hourlyCount[(i + 1) % 24] + hourlyCount[(i + 2) % 24];
      if (rangeCount > maxCount) {
        maxCount = rangeCount;
        maxStartHour = i;
      }
    }

    // 시간대 문자열 생성
    const startHour = (maxStartHour + 6) % 24;
    const endHour = (startHour + 3) % 24;
    const timeRange = `${startHour}시~${endHour}시`;

    return {
      processedData: Object.entries(hourlyCount)
        .map(([hour, count]) => ({
          x: parseInt(hour),
          y: count,
        }))
        .sort((a, b) => a.x - b.x),
      mostFrequentTimeRange: timeRange,
    };
  }, [data]);

  // 데이터 포인트 보정 및 연속성 확보
  const enhancedData = useMemo(() => {
    return processedData.map(({ x, y }) => {
      const value = y === 0 ? 0.3 : Math.max(y, 0.3);
      return value;
    });
  }, [processedData]);

  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 1000,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      background: "transparent",
    },
    colors: ["#00C853"],
    stroke: {
      curve: "smooth",
      width: 4,
      lineCap: "round",
    },
    markers: {
      size: 0,
    },
    fill: {
      type: "solid",
      opacity: 0.15,
    },
    grid: { show: false },
    xaxis: {
      categories: generateTimeLabels(),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
      min: 0.3,
      max: undefined,
      forceNiceScale: true,
      floating: true,
    },
    tooltip: {
      enabled: true,
      theme: theme.palette.mode,
      x: {
        formatter: (value) => {
          const hour = (value + 6) % 24;
          return `${hour.toString().padStart(2, "0")}:00`;
        },
      },
      y: {
        formatter: (value) => (value <= 0.3 ? "0회" : `${Math.round(value)}회`),
      },
      style: { fontSize: "12px" },
    },
  };

  const series = [
    {
      name: "배변 횟수",
      data: enhancedData,
    },
  ];

  return (
    <StyledCard>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AccessTimeIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            가장 빈번한 시간: {mostFrequentTimeRange}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ReactApexChart
            type="line"
            height={150}
            series={series}
            options={chartOptions}
          />
        </Grid>
      </Grid>
    </StyledCard>
  );
};

export default BowelTimeChart;
