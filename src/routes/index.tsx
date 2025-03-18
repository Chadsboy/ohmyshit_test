import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "../pages/Home";
import Foods from "../pages/Foods";
import Explore from "../pages/Explore";
import Calendar from "../pages/Calendar";
import Shop from "../pages/Shop";
import Manual from "../pages/Manual";
import Help from "../pages/Help";
import Contact from "../pages/Contact";
import Profile from "../pages/Profile";
import Statistics from "../pages/Statistics";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { Box, Typography } from "@mui/material";
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Favorite,
  Chat,
  CalendarMonth,
} from "@mui/icons-material";
import { Layout } from "../components/layout/Layout";

// 네비게이션 아이템 값 상수
export const NAV_HOME = "home";
export const NAV_EXPLORE = "explore";
export const NAV_FOODS = "foods";
export const NAV_CHAT = "chat";
export const NAV_CALENDAR = "calendar";

// 네비게이션 항목 정의
export const navigationItems = [
  {
    label: "탐색",
    icon: <ExploreIcon />,
    value: NAV_EXPLORE,
  },
  {
    label: "채팅",
    icon: <Chat />,
    value: NAV_CHAT,
  },
  {
    label: "홈",
    icon: <HomeIcon />,
    value: NAV_HOME,
  },
  {
    label: "식약품",
    icon: <Favorite />,
    value: NAV_FOODS,
  },
  {
    label: "캘린더",
    icon: <CalendarMonth />,
    value: NAV_CALENDAR,
  },
];

// 네비게이션 값으로부터 경로 반환
export const getPathFromNav = (nav: string): string => {
  switch (nav) {
    case NAV_HOME:
      return "/";
    case NAV_EXPLORE:
      return "/explore";
    case NAV_FOODS:
      return "/foods";
    case NAV_CHAT:
      return "/chat";
    case NAV_CALENDAR:
      return "/calendar";
    case "shop":
      return "/shop";
    case "manual":
      return "/manual";
    case "help":
      return "/help";
    case "contact":
      return "/contact";
    case "profile":
      return "/profile";
    default:
      return "/";
  }
};

// 경로로부터 네비게이션 값 반환
export const getNavFromPath = (path: string): string => {
  switch (path) {
    case "/":
      return NAV_HOME;
    case "/explore":
      return NAV_EXPLORE;
    case "/foods":
      return NAV_FOODS;
    case "/chat":
      return NAV_CHAT;
    case "/calendar":
      return NAV_CALENDAR;
    case "/shop":
      return "shop";
    case "/manual":
      return "manual";
    case "/help":
      return "help";
    case "/contact":
      return "contact";
    case "/profile":
      return "profile";
    default:
      return NAV_HOME;
  }
};

// 인증된 사용자를 위한 레이아웃과 라우팅을 제공하는 컴포넌트
export const AuthenticatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentNav, setCurrentNav] = useState(
    getNavFromPath(location.pathname)
  );

  // 경로 변경 시 네비게이션 상태 업데이트
  useEffect(() => {
    setCurrentNav(getNavFromPath(location.pathname));
  }, [location.pathname]);

  // 네비게이션 변경 이벤트 처리
  useEffect(() => {
    const handleNavChangeEvent = (e: CustomEvent) => {
      console.log("네비게이션 변경 이벤트 수신:", e.detail);
      setCurrentNav(e.detail);
      navigate(getPathFromNav(e.detail));
    };

    window.addEventListener("changeNav", handleNavChangeEvent as EventListener);

    return () => {
      window.removeEventListener(
        "changeNav",
        handleNavChangeEvent as EventListener
      );
    };
  }, [navigate]);

  // 현재 경로에 따라 네비게이션 값 설정
  const handleNavChange = (newValue: string) => {
    setCurrentNav(newValue);
    navigate(getPathFromNav(newValue));
  };

  return (
    <Layout
      value={currentNav}
      onChange={handleNavChange}
      items={navigationItems}
      title="건강도우미"
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/chat"
          element={
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h5">채팅 페이지</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                이 기능은 개발 중입니다.
              </Typography>
            </Box>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

// 비인증 사용자를 위한 라우트
export const UnauthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
