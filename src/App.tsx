import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { supabase } from "./lib/supabase";
import { CssBaseline } from "@mui/material";
import { AuthenticatedRoutes, UnauthenticatedRoutes } from "./routes/index";

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
  }, [isAuthenticated]);

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
    <Router>
      <CssBaseline />
      {isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </Router>
  );
}

export default App;
