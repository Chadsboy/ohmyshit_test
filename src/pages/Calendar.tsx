import { useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";
import { useEvents } from "../hooks/useEvents";
import EventForm from "../components/EventForm";
import { CalendarEvent } from "../types";
import ServerDay from "../components/calendar/ServerDay";
import EventModal from "../components/calendar/EventModal";
import AddEventButton from "../components/buttons/AddEventButton";
import {
  calendarStyles,
  containerStyles,
  loadingContainerStyles,
} from "../components/calendar/styles";

const Calendar = () => {
  const {
    highlightedDays,
    isLoading,
    error,
    getEventsByDate,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDateClick = async (date: Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");
    setSelectedDate(date);

    try {
      // 선택한 날짜의 이벤트 가져오기
      const eventsOnDate = await getEventsByDate(formattedDate);

      // 모든 경우에 이벤트 설정 및 모달 열기
      setSelectedEvents(eventsOnDate);
      setModalOpen(true);
    } catch (err) {
      console.error("이벤트를 가져오는 중 오류 발생:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenForm = () => {
    setSelectedEvent(undefined);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedEvent(undefined);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormOpen(true);
    setModalOpen(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      setIsDeleting(true);
      try {
        const { error } = await deleteEvent(eventId);
        if (error) {
          throw error;
        }

        // 이벤트 삭제 후 현재 선택된 날짜의 이벤트를 다시 불러오기
        if (selectedDate) {
          const formattedDate = selectedDate.format("YYYY-MM-DD");
          const eventsOnDate = await getEventsByDate(formattedDate);
          setSelectedEvents(eventsOnDate);

          // 모달을 닫지 않고 유지 (이 라인 제거)
          // setModalOpen(false);
        }
      } catch (err) {
        console.error("이벤트 삭제 중 오류 발생:", err);
        alert("이벤트를 삭제하는 중 오류가 발생했습니다.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmitEvent = async (
    eventData: Omit<CalendarEvent, "id" | "created_at">
  ) => {
    try {
      if (selectedEvent) {
        // 이벤트 수정
        const { error } = await updateEvent(selectedEvent.id, eventData);
        if (error) throw error;
      } else {
        // 새 이벤트 생성
        const { error } = await createEvent(eventData);
        if (error) throw error;
      }
    } catch (err) {
      console.error("이벤트 저장 중 오류 발생:", err);
      alert("이벤트를 저장하는 중 오류가 발생했습니다.");
      throw err;
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 1,
          fontSize: { xs: "1.3rem", sm: "1.6rem" },
          mt: 0,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          fontFamily: "'Montserrat', 'Roboto', sans-serif",
          position: "relative",
          display: "inline-block",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-3px",
            left: "50%",
            width: "40%",
            height: "2px",
            background:
              "linear-gradient(to right, transparent, rgba(25, 118, 210, 0.7), transparent)",
            transform: "translateX(-50%)",
            animation: "pulse 2s infinite ease-in-out",
          },
          "@keyframes pulse": {
            "0%": { opacity: 0.6 },
            "50%": { opacity: 1 },
            "100%": { opacity: 0.6 },
          },
        }}
      >
        Oh My Ca!endar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, mx: "auto", maxWidth: 800 }}>
          데이터를 불러오는 중 오류가 발생했습니다: {error.message}
        </Alert>
      )}

      <Box sx={containerStyles}>
        {isLoading ? (
          <Box sx={loadingContainerStyles}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateClick}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  highlightedDays,
                } as any,
              }}
              sx={calendarStyles}
            />
            <AddEventButton onClick={handleOpenForm} />
          </>
        )}
      </Box>

      <EventModal
        open={modalOpen}
        onClose={handleCloseModal}
        selectedEvents={selectedEvents}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        isDeleting={isDeleting}
        selectedDate={selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}
      />

      <EventForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitEvent}
        initialData={selectedEvent}
        title={selectedEvent ? "일정 수정" : "새 일정 추가"}
        selectedDate={selectedDate}
      />
    </Box>
  );
};

export default Calendar;
