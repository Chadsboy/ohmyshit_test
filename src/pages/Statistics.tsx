import React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import useStatistics from "../hooks/useStatistics";
import BowelTimeChart from "../components/charts/BowelTimeChart";

// 스타일이 적용된 Paper 컴포넌트
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
  height: "100%",
}));

const getConditionColor = (condition: "good" | "normal" | "bad") => {
  switch (condition) {
    case "good":
      return "success.main";
    case "normal":
      return "warning.main";
    case "bad":
      return "error.main";
    default:
      return "text.secondary";
  }
};

const Statistics = () => {
  const stats = useStatistics();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        통계
      </Typography>
      <Grid container spacing={3}>
        {/* 배변 시간 통계 */}
        <Grid item xs={12} md={4}>
          <BowelTimeChart
            data={stats.timeDistribution}
            title="My Best Sh!t Time"
            subtitle={`가장 빈번한 시간: ${stats.mostFrequentTime}`}
          />
        </Grid>

        {/* 배변 평균 통계 */}
        <Grid item xs={12} md={4}>
          <Item>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AssessmentIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                배변 평균
              </Typography>
            </Box>
            <Typography variant="body1">
              주간 평균 배변 횟수: {stats.weeklyAverage}회
            </Typography>
            <Typography variant="body1">
              평균 소요 시간: {stats.averageDuration}분
            </Typography>
          </Item>
        </Grid>

        {/* 배변 컨디션 */}
        <Grid item xs={12} md={4}>
          <Item>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <MonitorHeartIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                배변 컨디션
              </Typography>
            </Box>
            <Typography
              variant="body1"
              color={getConditionColor(stats.condition)}
            >
              {stats.condition === "good"
                ? "좋음"
                : stats.condition === "normal"
                ? "보통"
                : "나쁨"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.conditionMessage}
            </Typography>
          </Item>
        </Grid>

        {/* 상세 통계 차트 영역 */}
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6" component="h2" gutterBottom>
              상세 통계
            </Typography>
            {/* 여기에 차트 컴포넌트가 들어갈 예정 */}
            <Typography variant="body2" color="text.secondary">
              차트는 추후 구현 예정입니다.
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics;
