import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Foods from "./pages/Foods";
import Explore from "./pages/Explore";
import Calendar from "./pages/Calendar";
import Shop from "./pages/Shop";
import Manual from "./pages/Manual";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Favorite,
  Chat,
  CalendarMonth,
} from "@mui/icons-material";
import { supabase } from "./lib/supabase";
import { Layout } from "./components/layout/Layout";

// 네비게이션 아이템 값 상수
const NAV_HOME = "home";
const NAV_EXPLORE = "explore";
const NAV_FOODS = "foods";
const NAV_CHAT = "chat";
const NAV_CALENDAR = "calendar";

// 네비게이션 항목 정의
const navigationItems = [
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
const getPathFromNav = (nav: string): string => {
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
const getNavFromPath = (path: string): string => {
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
const AuthenticatedApp = () => {
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

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // 초기 로딩 시 로컬 스토리지에서 인증 상태 확인
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // 세션 상태 확인
  useEffect(() => {
    let isMounted = true;
    let authChangeTimerId: NodeJS.Timeout | null = null;

    // 타임아웃 설정 - 10초 이상 세션 확인이 진행되면 로딩 종료
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log("세션 확인 타임아웃 - 로딩 종료");
        setLoading(false);
      }
    }, 10000);

    const checkSession = async () => {
      try {
        console.log("App - 세션 확인 중...");
        const { data, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error("App - 세션 확인 오류:", error);
          setError(error.message);
          setLoading(false);
          return;
        }

        console.log("App - 세션 데이터:", data);

        if (data.session) {
          setSession(data.session);
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
        } else if (!isAuthenticated) {
          // 로컬에 인증 정보가 없을 때만 세션을 null로 설정
          setSession(null);
        }
        setLoading(false);

        // 세션 변경 이벤트 리스너
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            if (!isMounted) return;

            console.log("App - 인증 상태 변경:", event, newSession);

            // 이전 타이머 취소
            if (authChangeTimerId) {
              clearTimeout(authChangeTimerId);
            }

            // 인증 상태 변경 시 짧은 지연 시간 추가 (상태 안정화)
            authChangeTimerId = setTimeout(() => {
              if (event === "SIGNED_OUT") {
                console.log("사용자가 로그아웃되었습니다");
                setSession(null);
                setIsAuthenticated(false);
                localStorage.removeItem("isAuthenticated");
              } else if (event === "SIGNED_IN") {
                setSession(newSession);
                setIsAuthenticated(true);
                localStorage.setItem("isAuthenticated", "true");
              } else if (event === "TOKEN_REFRESHED" && newSession) {
                setSession(newSession);
                // 토큰 갱신 시에도 인증 상태 유지
                setIsAuthenticated(true);
                localStorage.setItem("isAuthenticated", "true");
              }
            }, 100); // 100ms 지연 - 상태 안정화를 위한 시간
          }
        );

        return () => {
          if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      } catch (error: any) {
        if (!isMounted) return;

        console.error("App - 세션 확인 오류:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      if (authChangeTimerId) {
        clearTimeout(authChangeTimerId);
      }
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated]);

  // 에러 발생시 표시
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          오류가 발생했습니다
        </Typography>
        <Typography variant="body2">{error}</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          페이지를 새로고침하거나 나중에 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  // 로딩 중일 때
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          사용자 정보를 확인 중입니다...
        </Typography>
      </Box>
    );
  }

  // 인증되지 않은 경우만 로그인/회원가입 화면으로 라우팅
  // 로컬 스토리지의 인증 상태를 우선 확인하여 불필요한 리다이렉션 방지
  if (!session && !isAuthenticated) {
    return (
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Box>
      </Router>
    );
  }

  // 로그인된 사용자를 위한 메인 레이아웃과 라우팅
  return (
    <Router>
      <AuthenticatedApp />
    </Router>
  );
}

export default App;
