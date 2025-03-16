import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import {
  Home,
  Search,
  Explore,
  Chat,
  CalendarMonth,
} from "@mui/icons-material";
import { ReactNode } from "react";

interface NavigationItemType {
  label: string;
  icon: ReactNode;
  value: string;
}

interface FooterProps {
  value: string;
  onChange: (value: string) => void;
  items?: NavigationItemType[];
}

export const Footer = ({
  value,
  onChange,
  items = [
    {
      label: "탐색",
      icon: <Explore />,
      value: "explore",
    },
    {
      label: "채팅",
      icon: <Chat />,
      value: "chat",
    },
    {
      label: "홈",
      icon: <Home />,
      value: "home",
    },
    {
      label: "검색",
      icon: <Search />,
      value: "search",
    },
    {
      label: "캘린더",
      icon: <CalendarMonth />,
      value: "calendar",
    },
  ],
}: FooterProps) => {
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderTop: 1,
        borderColor: "divider",
        boxShadow: 3,
        height: "56px",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        showLabels
        sx={{
          height: 56,
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            padding: "6px 0",
            "&:focus": {
              outline: "none",
            },
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
          "& .MuiBottomNavigationAction-root:nth-of-type(3)": {
            "& .MuiSvgIcon-root": {
              fontSize: "28px",
              transform: "scale(1.2)",
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.875rem",
              fontWeight: "bold",
            },
          },
        }}
      >
        {items.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
            sx={{
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
