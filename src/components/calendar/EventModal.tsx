import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Box,
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

  // 날짜 포맷 변환 (YYYY-MM-DD를 YY-MM-DD로)
  const formattedDate = React.useMemo(() => {
    if (!selectedDate) return "";
    try {
      const date = parse(selectedDate, "yyyy-MM-dd", new Date());
      return format(date, "yy-MM-dd", { locale: ko });
    } catch (error) {
      console.error("날짜 변환 오류:", error);
      return selectedDate;
    }
  }, [selectedDate]);

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      setIsLocalDeleting(true);
      try {
        await onDeleteEvent(eventId);
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
        ) : (
          <EventList
            events={selectedEvents || []}
            onEdit={onEditEvent}
            onDelete={handleDeleteEvent}
            disabled={isActuallyDeleting}
            hideActions={true} // 수정/삭제 버튼 숨김
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
