import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { supabase } from "./lib/supabase";
import { CssBaseline } from "@mui/material";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { TimerProvider } from "./contexts/TimerContext";
import { EventProvider } from "./contexts/EventContext";

// 페이지 임포트
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Explore from "./pages/Explore";
import Foods from "./pages/Foods";
import Calendar from "./pages/Calendar";
import Shop from "./pages/Shop";
import Manual from "./pages/Manual";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Article from "./pages/Article";

// 아이콘 및 컴포넌트 임포트
import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Favorite,
  Chat,
  CalendarMonth,
} from "@mui/icons-material";
import { Layout } from "./components/layout/Layout";

// 네비게이션 아이템 값 상수
const NAV_HOME = "home";
const NAV_EXPLORE = "explore";
const NAV_FOODS = "foods";
const NAV_ARTICLE = "article";
const NAV_CALENDAR = "calendar";

// 네비게이션 항목 정의
const navigationItems = [
  {
    label: "탐색",
    icon: <ExploreIcon />,
    value: NAV_EXPLORE,
  },
  {
    label: "읽을거리",
    icon: <Chat />,
    value: NAV_ARTICLE,
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
    case NAV_ARTICLE:
      return "/article";
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
    case "/article":
      return NAV_ARTICLE;
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

// 인증된 사용자를 위한 레이아웃과 라우팅 컴포넌트
const AuthenticatedRoutes = () => {
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
        <Route path="/article" element={<Article />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

// 비인증 사용자를 위한 라우트
const UnauthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const AppContent = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // 초기 로딩 시 로컬 스토리지에서 인증 상태 확인
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const { resetAllLoadingStates } = useLoading();

  // 세션 상태 확인
  useEffect(() => {
    let isMounted = true;
    let authChangeTimerId: NodeJS.Timeout | null = null;

    // 타임아웃 설정 - 10초 이상 세션 확인이 진행되면 로딩 종료
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log("세션 확인 타임아웃 - 로딩 종료");

        // 글로벌 로딩 상태 초기화
        setLoading(false);

        // 모든 컴포넌트의 로딩 상태 초기화
        resetAllLoadingStates();
        console.log("세션 확인 타임아웃 - 모든 컴포넌트의 로딩 상태 초기화됨");
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

            // 타이머 설정 - 연속적인 이벤트 발생 시 마지막 이벤트만 처리
            authChangeTimerId = setTimeout(() => {
              if (event === "SIGNED_IN" && newSession) {
                setSession(newSession);
                setIsAuthenticated(true);
                localStorage.setItem("isAuthenticated", "true");
              } else if (event === "SIGNED_OUT") {
                setSession(null);
                setIsAuthenticated(false);
                localStorage.removeItem("isAuthenticated");
              }
            }, 300);
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (err) {
        if (!isMounted) return;
        console.error("App - 세션 확인 중 예외 발생:", err);
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (authChangeTimerId) {
        clearTimeout(authChangeTimerId);
      }
    };
  }, [isAuthenticated, resetAllLoadingStates]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
    } catch (err) {
      console.error("로그아웃 중 오류 발생:", err);
    }
  };

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value);
    if (value) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          세션 로딩 중...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: 3,
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          오류가 발생했습니다
        </Typography>
        <Typography variant="body1" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      {isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </>
  );
};

function App() {
  return (
    <EventProvider>
      <Router>
        <LoadingProvider>
          <TimerProvider>
            <CssBaseline />
            <AppContent />
          </TimerProvider>
        </LoadingProvider>
      </Router>
    </EventProvider>
  );
}

export default App;
