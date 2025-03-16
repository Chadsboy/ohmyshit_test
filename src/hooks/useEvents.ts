import { useState, useEffect, useCallback } from "react";
import { EventService } from "../services/eventService";
import { CalendarEvent, ServiceResponse } from "../types";

interface UseEventsReturn {
  events: CalendarEvent[];
  highlightedDays: string[];
  isLoading: boolean;
  error: Error | null;
  refreshEvents: () => Promise<void>;
  getEventsByDate: (date: string) => Promise<CalendarEvent[]>;
  createEvent: (
    event: Omit<CalendarEvent, "id" | "created_at">
  ) => Promise<ServiceResponse<CalendarEvent>>;
  updateEvent: (
    id: string,
    event: Partial<CalendarEvent>
  ) => Promise<ServiceResponse<CalendarEvent>>;
  deleteEvent: (id: string) => Promise<ServiceResponse<null>>;
}

/**
 * 이벤트 관리를 위한 커스텀 훅
 * 이벤트 데이터를 가져오고, 생성, 수정, 삭제하는 기능을 제공합니다.
 */
export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 모든 이벤트 가져오기
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await EventService.getAllEvents();

      if (error) {
        throw error;
      }

      setEvents(data || []);

      // 이벤트가 있는 날짜 추출
      const uniqueDates = [...new Set(data?.map((event) => event.date) || [])];
      setHighlightedDays(uniqueDates);
    } catch (err) {
      console.error("이벤트 데이터를 가져오는 중 오류 발생:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 이벤트 데이터 가져오기
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 특정 날짜의 이벤트 가져오기
  const getEventsByDate = async (date: string): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await EventService.getEventsByDate(date);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (err) {
      console.error(`${date} 날짜의 이벤트를 가져오는 중 오류 발생:`, err);
      return [];
    }
  };

  // 이벤트 생성
  const createEvent = async (
    event: Omit<CalendarEvent, "id" | "created_at">
  ): Promise<ServiceResponse<CalendarEvent>> => {
    try {
      const result = await EventService.createEvent(event);

      if (!result.error) {
        // 이벤트 목록 새로고침
        await fetchEvents();
      }

      return result;
    } catch (err) {
      console.error("이벤트 생성 중 오류 발생:", err);
      return { data: null, error: err as Error };
    }
  };

  // 이벤트 수정
  const updateEvent = async (
    id: string,
    event: Partial<CalendarEvent>
  ): Promise<ServiceResponse<CalendarEvent>> => {
    try {
      const result = await EventService.updateEvent(id, event);

      if (!result.error) {
        // 이벤트 목록 새로고침
        await fetchEvents();
      }

      return result;
    } catch (err) {
      console.error("이벤트 수정 중 오류 발생:", err);
      return { data: null, error: err as Error };
    }
  };

  // 이벤트 삭제
  const deleteEvent = async (id: string): Promise<ServiceResponse<null>> => {
    try {
      const result = await EventService.deleteEvent(id);

      if (!result.error) {
        // 이벤트 목록 새로고침
        await fetchEvents();
      }

      return result;
    } catch (err) {
      console.error("이벤트 삭제 중 오류 발생:", err);
      return { data: null, error: err as Error };
    }
  };

  return {
    events,
    highlightedDays,
    isLoading,
    error,
    refreshEvents: fetchEvents,
    getEventsByDate,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
