export const calendarStyles = {
  width: "100%",
  height: "auto",
  transform: { xs: "scale(1.05)", sm: "none" },
  transformOrigin: "center top",
  mb: { xs: 1, sm: 0 },
  pb: { xs: 1, sm: 0 },
  "& .MuiPickersCalendarHeader-root": {
    pl: { xs: 1, sm: 2 },
    pr: { xs: 1, sm: 2 },
    mb: { xs: 1, sm: 1 },
  },
  "& .MuiDayCalendar-header": {
    mb: { xs: 0.5, sm: 0.5 },
  },
  "& .MuiPickersDay-root": {
    fontSize: { xs: "0.95rem", sm: "1rem" },
    width: { xs: 36, sm: 40, md: 46 },
    height: { xs: 36, sm: 40, md: 46 },
    margin: { xs: "0 2px", sm: "0 4px" },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
    "&.Mui-selected": {
      boxShadow: "none",
    },
    "&.Mui-focused": {
      outline: "none",
      boxShadow: "none",
    },
  },
  "& .MuiDayCalendar-weekContainer": {
    margin: { xs: "2px 0", sm: "3px 0" },
  },
  "& .MuiTypography-root": {
    fontSize: { xs: "0.95rem", sm: "1rem" },
  },
  "& .MuiPickersCalendarHeader-label": {
    fontSize: { xs: "1.05rem", sm: "1.25rem" },
  },
  "& .MuiPickersArrowSwitcher-button": {
    padding: { xs: "6px", sm: "12px" },
    "&:focus": {
      outline: "none",
      boxShadow: "none",
    },
  },
  "& *:focus": {
    outline: "none !important",
  },
  "& .MuiButtonBase-root:focus": {
    boxShadow: "none !important",
  },
};

export const containerStyles = {
  width: "100%",
  maxWidth: { xs: "100%", sm: 700, md: 800 },
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  pb: { xs: 8, sm: 10 },
};

export const loadingContainerStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 500,
  width: "100%",
};
