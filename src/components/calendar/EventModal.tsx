import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Tooltip,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import EventList from "./EventList";
import { CalendarEvent } from "../../types";
import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: string;
  selectedEvents: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => Promise<void>;
  isDeleting?: boolean;
}

/**
 * 특정 날짜의 이벤트 목록을 모달로 표시하는 컴포넌트
 */
const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  selectedDate,
  selectedEvents = [],
  onEditEvent,
  onDeleteEvent,
  isDeleting = false,
}) => {
  const [isLocalDeleting, setIsLocalDeleting] = useState(false);
  const isActuallyDeleting = isDeleting || isLocalDeleting;

  // 디버깅을 위한 코드 추가
  React.useEffect(() => {
    console.log("EventModal - selectedDate:", selectedDate);
    console.log("EventModal - selectedEvents:", selectedEvents);
  }, [selectedDate, selectedEvents]);

  // 날짜 포맷 변환 (YYYY-MM-DD를 YYYY-MM-DD EEE 형식으로 변경)
  const formattedDate = React.useMemo(() => {
    if (!selectedDate) return "";
    try {
      const date = parse(selectedDate, "yyyy-MM-dd", new Date());
      return format(date, "yyyy-MM-dd EEE", { locale: ko });
    } catch (error) {
      console.error("날짜 변환 오류:", error);
      return selectedDate;
    }
  }, [selectedDate]);

  // 이벤트를 날짜/시간 기준 오름차순으로 정렬
  const sortedEvents = React.useMemo(() => {
    if (!selectedEvents?.length) return [];

    return [...selectedEvents].sort((a, b) => {
      // 날짜 정보 가져오기 (일정 제목에서 시간 추출하기)
      const getTimeFromTitle = (title: string) => {
        // 배변 성공/실패 (HH:MM) 형식에서 시간 추출
        const timeMatch = title.match(/\((\d{2}:\d{2})\)/);
        return timeMatch ? timeMatch[1] : "00:00";
      };

      const timeA = getTimeFromTitle(a.title);
      const timeB = getTimeFromTitle(b.title);

      console.log(`정렬: ${a.title} (${timeA}) vs ${b.title} (${timeB})`);

      // 시간 기준 오름차순 정렬
      return timeA.localeCompare(timeB);
    });
  }, [selectedEvents]);

  // 개별 이벤트 삭제 처리 함수
  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      setIsLocalDeleting(true);
      try {
        await onDeleteEvent(eventId);
        // 모달을 닫지 않고 유지합니다 (기존 코드 제거)
      } catch (error) {
        console.error("이벤트 삭제 중 오류 발생:", error);
      } finally {
        setIsLocalDeleting(false);
      }
    },
    [onDeleteEvent]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="event-modal-title"
      PaperProps={{
        sx: {
          height: "auto",
          maxHeight: "400px", // 모달 높이 고정 (약 4개 이벤트가 보이는 크기)
        },
      }}
    >
      <DialogTitle id="event-modal-title" sx={{ m: 0, p: 2 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          {formattedDate}
        </Typography>

        {/* 닫기 버튼 */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          overflowY: "scroll", // 스크롤 가능하게 설정
          "&::-webkit-scrollbar": { display: "none" }, // 웹킷 브라우저에서 스크롤바 숨김
          scrollbarWidth: "none", // Firefox에서 스크롤바 숨김
          msOverflowStyle: "none", // IE/Edge에서 스크롤바 숨김
        }}
      >
        {isActuallyDeleting ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : sortedEvents.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
              height: "100px",
            }}
          >
            <Typography color="text.secondary">
              해당 날짜의 기록이 없습니다.
            </Typography>
          </Box>
        ) : (
          <EventList
            events={sortedEvents}
            onEdit={onEditEvent}
            onDelete={handleDeleteEvent}
            disabled={isActuallyDeleting}
            hideActions={true} // 리스트 내 기본 수정/삭제 버튼은 숨김 (커스텀 버튼 사용)
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
