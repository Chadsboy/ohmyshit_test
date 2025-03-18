import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Box,
  Stack,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { CalendarEvent } from "../../types";

interface StoolAmountIndicatorProps {
  amount: string | null;
}

/**
 * 배변량을 시각적으로 표현하는 컴포넌트
 * - 많음: 막대 3개
 * - 보통: 막대 2개
 * - 적음: 막대 1개
 * - 이상: 빨간색 막대
 */
const StoolAmountIndicator: React.FC<StoolAmountIndicatorProps> = ({
  amount,
}) => {
  const theme = useTheme();

  if (!amount) return null;

  // 이상일 경우 주황색으로 변경
  const barColor =
    amount === "이상" ? theme.palette.warning.main : theme.palette.success.main;

  // 막대 개수 결정
  let barCount = 0;
  switch (amount) {
    case "많음":
      barCount = 3;
      break;
    case "보통":
      barCount = 2;
      break;
    case "적음":
    default:
      barCount = 1;
      break;
  }

  // 막대 생성 - 모든 막대는 동일한 크기로, 오른쪽에서부터 채워짐
  const bars = [];
  for (let i = 0; i < 3; i++) {
    // 맨 오른쪽이 인덱스 0, 왼쪽으로 갈수록 1, 2가 됨
    const isActive = amount === "이상" ? true : i < barCount;

    bars.push(
      <Box
        key={i}
        sx={{
          width: 8,
          height: 18,
          backgroundColor: isActive ? barColor : theme.palette.grey[300],
          marginRight: 0.5, // 마진 축소
          // borderRadius 제거 (직사각형 모양)
        }}
      />
    );
  }

  // 바를 왼쪽에서 오른쪽 순서로 표시
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: 18,
        flexDirection: "row-reverse",
      }}
    >
      {bars}
    </Box>
  );
};

interface EventListProps {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  disabled?: boolean;
  hideActions?: boolean;
}

/**
 * 이벤트 목록 컴포넌트
 * 선택한 날짜의 이벤트 목록을 표시합니다.
 */
const EventList: React.FC<EventListProps> = ({
  events = [],
  onEdit,
  onDelete,
  disabled = false,
  hideActions = false,
}) => {
  const theme = useTheme();

  if (!events || events.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="text.secondary">
          이 날짜에 등록된 일정이 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: "100%" }}>
      {events.map((event, index) => {
        // 제목에서 시간과 배변량 추출
        const timeMatch = event.title.match(/\((\d{2}:\d{2})\)/);
        const time = timeMatch ? timeMatch[1] : "";

        const isSuccess = event.title.includes("성공");

        // 배변량 추출
        const amountMatch = event.title.match(/- (많음|보통|적음|이상)/);
        const amount = amountMatch ? amountMatch[1] : null;

        // 설명에서 소요 시간과 메모 추출
        const durationMatch = event.description.match(/소요 시간: (\d+)분/);
        const duration = durationMatch ? durationMatch[1] : "";

        // 메모 추출
        const memoMatch = event.description.match(/메모: (.+)/);
        const memo = memoMatch ? memoMatch[1] : "";

        // 개별 이벤트 삭제 핸들러
        const handleDeleteSingleEvent = (e: React.MouseEvent) => {
          e.stopPropagation(); // 이벤트 버블링 방지
          if (window.confirm("이 기록을 삭제하시겠습니까?")) {
            onDelete(event.id);
          }
        };

        return (
          <React.Fragment key={event.id}>
            <ListItem
              secondaryAction={
                !hideActions ? (
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => onEdit(event)}
                      disabled={disabled}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDelete(event.id)}
                      disabled={disabled}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* 소요 시간 표시 */}
                    {duration && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontWeight: "medium",
                          mr: 1,
                        }}
                      >
                        {duration}분
                      </Typography>
                    )}

                    {/* 개별 삭제 버튼 */}
                    <Tooltip title="이 기록 삭제">
                      <IconButton
                        size="small"
                        aria-label="delete single event"
                        onClick={handleDeleteSingleEvent}
                        disabled={disabled}
                        sx={{
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )
              }
              sx={{
                pr: 2,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                {/* 헤더 영역 - 시간과 상태 */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {/* 시간 */}
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontWeight: "bold",
                      mr: 1,
                    }}
                  >
                    {time}
                  </Typography>

                  {/* 성공/실패 상태 */}
                  {isSuccess ? (
                    <CheckCircleIcon
                      sx={{
                        color: theme.palette.success.main,
                        mr: 1,
                      }}
                    />
                  ) : (
                    <CancelIcon
                      sx={{
                        color: theme.palette.error.main,
                        mr: 1,
                      }}
                    />
                  )}

                  {/* 배변량 표시 */}
                  {isSuccess && <StoolAmountIndicator amount={amount} />}
                </Box>

                {/* 내용 영역 - 메모 */}
                {/* 성공일 경우에만 메모 표시 */}
                {isSuccess && memo && (
                  <Typography variant="body2" color="text.secondary">
                    메모: {memo}
                  </Typography>
                )}
              </Box>
            </ListItem>
            {index < events.length - 1 && <Divider component="li" />}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default EventList;
