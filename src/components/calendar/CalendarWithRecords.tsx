import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Add as AddIcon, CheckCircle, Cancel } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";
import { supabase } from "../../lib/supabase";
import BowelRecordForm from "./BowelRecordForm";
import { BowelRecordService } from "../../services/bowelRecordService";
import { BowelRecord } from "../../types";

// dayjs에 필요한 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 시간대 설정
const KOREA_TIMEZONE = "Asia/Seoul";

const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
}));

const TitleBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const RecordsList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

const HighlightedDay = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

/**
 * 배변 기록이 있는 캘린더 컴포넌트
 * 새로운 BowelRecordService를 사용하여 타임존 문제 없이 기록 관리
 */
const CalendarWithRecords: React.FC = () => {
  // 상태 관리
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [records, setRecords] = useState<BowelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datesWithRecords, setDatesWithRecords] = useState<Set<string>>(
    new Set()
  );

  // 날짜 변경 핸들러
  const handleDateChange = (date: Dayjs) => {
    const newFormattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(date);
    setFormattedDate(newFormattedDate);
  };

  // 폼 열기 핸들러
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  // 폼 닫기 핸들러
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // 기록 불러오기
  const loadRecords = async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await BowelRecordService.getRecordsByDate(date);

      if (response.error) {
        throw response.error;
      }

      setRecords(response.data || []);
    } catch (err) {
      setError((err as Error).message || "기록을 불러오는 데 실패했습니다.");
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 기록이 있는 날짜 목록 불러오기
  const loadRecordDates = async () => {
    try {
      // 모든 기록을 불러오기 (record_date 필드만 사용)
      const { data, error } = await supabase
        .from("bowel_records")
        .select("record_date");

      if (error) throw error;

      // 중복 제거하여 날짜 Set 생성
      const dateSet = new Set<string>();
      data?.forEach((item: { record_date: string }) => {
        if (item.record_date) {
          // record_date가 유효한지 확인
          if (dayjs(item.record_date, "YYYY-MM-DD", true).isValid()) {
            // 날짜 추가
            dateSet.add(item.record_date);
          }
        }
      });

      console.log("[CalendarWithRecords] 기록 있는 날짜:", Array.from(dateSet));
      setDatesWithRecords(dateSet);
    } catch (err) {
      console.error("[CalendarWithRecords] 기록 날짜 로딩 실패:", err);
    }
  };

  // 저장 성공 후 처리
  const handleSaveSuccess = () => {
    // 현재 날짜의 기록 다시 불러오기
    loadRecords(formattedDate);
    // 날짜 목록 다시 불러오기
    loadRecordDates();
  };

  // 선택한 날짜가 변경될 때 해당 날짜의 기록 불러오기
  useEffect(() => {
    if (formattedDate) {
      loadRecords(formattedDate);
    }
  }, [formattedDate]);

  // 컴포넌트 마운트 시 오늘 날짜 설정 및 기록 있는 날짜 불러오기
  useEffect(() => {
    const today = dayjs();
    setSelectedDate(today);
    setFormattedDate(today.format("YYYY-MM-DD"));
    loadRecordDates();
  }, []);

  // 캘린더 날짜 렌더링 함수
  const renderDay = (
    day: Dayjs,
    _selectedDays: Dayjs[],
    pickersDayProps: any
  ) => {
    const formattedDay = day.format("YYYY-MM-DD");

    // 명확하게 그 날짜에 기록이 있는지 확인
    const hasRecords = datesWithRecords.has(formattedDay);

    return (
      <HighlightedDay
        key={day.toString()}
        overlap="circular"
        badgeContent={hasRecords ? "•" : undefined}
        {...pickersDayProps}
      />
    );
  };

  // 한국 시간대로 시간 형식을 변환하는 함수
  const formatTimeInKST = (isoTimeString: string): string => {
    return dayjs(isoTimeString).tz(KOREA_TIMEZONE).format("HH:mm");
  };

  return (
    <CalendarContainer>
      <TitleBar>
        <Typography variant="h6" fontWeight="bold">
          배변 기록 캘린더
        </Typography>
        <Tooltip title="새 기록 추가">
          <IconButton color="primary" onClick={handleOpenForm} size="large">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </TitleBar>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          slots={{
            day: renderDay as any,
          }}
        />
      </LocalizationProvider>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" fontWeight="bold">
        {formattedDate} 기록
      </Typography>

      <RecordsList>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={30} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : records.length === 0 ? (
          <Box textAlign="center" p={2}>
            <Typography color="text.secondary">기록이 없습니다.</Typography>
          </Box>
        ) : (
          <List>
            {records.map((record) => {
              // 한국 시간대로 시간 변환
              const timeStr = formatTimeInKST(record.start_time);

              return (
                <ListItem key={record.id} divider>
                  <ListItemIcon>
                    {record.success ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Cancel color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={`${timeStr} - ${
                      record.success ? "성공" : "시도"
                    } ${record.amount ? `(${record.amount})` : ""}`}
                    secondary={`${record.duration}분 소요${
                      record.memo ? ` • ${record.memo}` : ""
                    }`}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </RecordsList>

      {/* 새 기록 추가 폼 */}
      <BowelRecordForm
        open={isFormOpen}
        onClose={handleCloseForm}
        selectedDate={formattedDate}
        onSuccess={handleSaveSuccess}
      />
    </CalendarContainer>
  );
};

export default CalendarWithRecords;
