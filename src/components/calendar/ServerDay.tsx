import React from "react";
import { Badge, styled } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import type { PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Dayjs } from "dayjs";
import { KOREA_TIMEZONE } from "../../utils/dateHelpers";
import CircleIcon from "@mui/icons-material/Circle";

interface ServerDayProps extends PickersDayProps<Dayjs> {
  highlightedDays?: string[];
}

// 커스텀 뱃지 스타일
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#4caf50",
    color: "white",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    padding: 0,
    minWidth: "8px",
    right: "14%",
    top: "14%",
  },
}));

/**
 * 커스텀 Day 컴포넌트
 * 이벤트가 있는 날짜에 배지를 표시합니다.
 */
const ServerDay: React.FC<ServerDayProps> = (props) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  // 한국 시간대 기준으로 날짜 포맷 (명시적으로 UTC에서 변환)
  const formattedDate = day.tz(KOREA_TIMEZONE).format("YYYY-MM-DD");

  // 날짜 및 하이라이트 상태 디버깅
  const isHighlighted =
    !outsideCurrentMonth && highlightedDays.includes(formattedDate);

  return (
    <StyledBadge
      key={day.toString()}
      overlap="circular"
      variant="dot"
      invisible={!isHighlighted}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          ...(isHighlighted && {
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(76, 175, 80, 0.2)",
            },
          }),
        }}
      />
    </StyledBadge>
  );
};

export default ServerDay;
