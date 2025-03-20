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
  const [isFormLoading, setIsFormLoading] = useState(false); // 폼 로딩 상태
  const [formKey, setFormKey] = useState(Date.now()); // 폼 강제 리마운트용 키
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
    // 이미 열려있다면 닫고 다시 열기 (강제 리셋)
    if (isFormOpen) {
      console.log("[CalendarWithRecords] 폼이 이미 열려있어 재초기화");
      setIsFormOpen(false);
      setIsFormLoading(false);

      // 약간의 지연 후 다시 열기
      setTimeout(() => {
        setFormKey(Date.now());
        setIsFormOpen(true);
      }, 50);
      return;
    }

    // 새로운 키 생성으로 강제 리마운트
    setFormKey(Date.now());
    // 로딩 상태 초기화
    setIsFormLoading(false);
    console.log("[CalendarWithRecords] 폼 열기 - 새 키:", formKey);
    // 폼 열기
    setIsFormOpen(true);
  };

  // 폼 닫기 핸들러
  const handleCloseForm = () => {
    // 먼저 로딩 상태 초기화
    console.log("[CalendarWithRecords] 폼 닫기 - 로딩 상태 초기화");
    setIsFormLoading(false);

    // 그 다음 폼 닫기
    console.log("[CalendarWithRecords] 폼 닫기 - 폼 상태 false로 설정");
    setIsFormOpen(false);
  };

  // 폼 로딩 상태 핸들러
  const handleFormLoadingChange = (loading: boolean) => {
    console.log("[CalendarWithRecords] 폼 로딩 상태 변경:", loading);
    setIsFormLoading(loading);
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

      // 기록을 시간순으로 정렬 (오름차순)
      const sortedRecords = (response.data || []).sort((a, b) => {
        return a.start_time.localeCompare(b.start_time);
      });

      console.log(
        `[CalendarWithRecords] ${date} 날짜 기록 ${sortedRecords.length}개 로드됨`
      );
      setRecords(sortedRecords);
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
      console.log("[CalendarWithRecords] 기록 있는 날짜 불러오기 시작");

      // 모든 기록을 불러오기 (record_date 필드만 사용)
      const { data, error } = await supabase
        .from("bowel_records")
        .select("record_date")
        .not("record_date", "is", null); // NULL 값 제외

      if (error) throw error;

      console.log("[CalendarWithRecords] DB에서 불러온 날짜 데이터:", data);

      // 중복 제거하여 날짜 Set 생성
      const dateSet = new Set<string>();
      data?.forEach((item: { record_date: string }) => {
        // null, undefined, 빈 문자열 확인
        if (
          item.record_date &&
          typeof item.record_date === "string" &&
          item.record_date.trim() !== ""
        ) {
          // YYYY-MM-DD 형식의 유효한 날짜인지 확인 (엄격한 검증)
          if (dayjs(item.record_date, "YYYY-MM-DD", true).isValid()) {
            // 날짜 추가 전 로그
            console.log(
              `[CalendarWithRecords] 유효한 날짜 감지: ${item.record_date}`
            );
            dateSet.add(item.record_date);
          } else {
            console.warn(
              `[CalendarWithRecords] 유효하지 않은 날짜 형식 무시: ${item.record_date}`
            );
          }
        } else {
          console.warn(`[CalendarWithRecords] 빈 record_date 값 무시`);
        }
      });

      const validDates = Array.from(dateSet);
      console.log(
        "[CalendarWithRecords] 처리 후 유효한 기록 날짜:",
        validDates
      );

      // 기존 상태와 비교하여 변경 사항이 있는지 확인
      const currentDates = Array.from(datesWithRecords);
      const hasChanged =
        currentDates.length !== validDates.length ||
        !currentDates.every((date) => validDates.includes(date));

      if (hasChanged) {
        console.log("[CalendarWithRecords] 날짜 목록 업데이트됨");
        setDatesWithRecords(dateSet);
      } else {
        console.log("[CalendarWithRecords] 날짜 목록 변경 없음");
      }
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
    // 폼 로딩 상태 초기화
    setIsFormLoading(false);
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

      {/* 배변 기록 추가 폼 */}
      {isFormOpen ? (
        <BowelRecordForm
          key={`bowel-form-${formKey}-${Math.random()}`}
          open={true}
          onClose={handleCloseForm}
          selectedDate={formattedDate}
          onSuccess={handleSaveSuccess}
          isLoading={isFormLoading}
          onLoadingChange={handleFormLoadingChange}
        />
      ) : null}
    </CalendarContainer>
  );
};

export default CalendarWithRecords;
