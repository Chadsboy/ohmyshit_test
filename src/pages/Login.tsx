import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Container,
  Paper,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthTabs from "../components/auth/AuthTabs";
import LoginForm from "../components/auth/LoginForm";
import SocialLogin from "../components/auth/SocialLogin";

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isVerySmallScreen = useMediaQuery("(max-width:350px)");
  const [activeTab, setActiveTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  // useAuth 훅 사용
  const { loading, error, handleEmailLogin, handleGoogleLogin, checkSession } =
    useAuth();

  // 세션 확인
  useEffect(() => {
    let isMounted = true;

    // 세션 체크 함수
    const checkUserSession = async () => {
      try {
        console.log("로그인 페이지 - 세션 확인 중...");
        const hasSession = await checkSession(5000);

        if (!isMounted) return;

        if (hasSession) {
          console.log("이미 로그인됨, 홈으로 리다이렉트");
          navigate("/");
        }
      } catch (error) {
        console.error("세션 확인 오류:", error);
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    checkUserSession();

    return () => {
      isMounted = false;
    };
  }, [navigate, checkSession]);

  // 탭 변경 핸들러
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 이메일 로그인 처리
  const onLogin = async (email: string, password: string) => {
    try {
      setSuccessMessage("");
      const success = await handleEmailLogin(email, password);

      if (success) {
        setSuccessMessage("로그인 성공! 홈 페이지로 이동합니다...");
      }

      return success;
    } catch (error) {
      console.error("로그인 중 오류:", error);
      return false;
    }
  };

  // 구글 로그인 처리
  const onGoogleLogin = async () => {
    try {
      setSuccessMessage("");
      return await handleGoogleLogin();
    } catch (error) {
      console.error("구글 로그인 중 오류:", error);
      return false;
    }
  };

  // 로딩 중이면 스피너 표시
  if (checkingSession) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          사용자 정보를 확인 중입니다...
        </Typography>
      </Box>
    );
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        p: { xs: 0, sm: 2 },
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        m: 0,
        maxWidth: "100%",
      }}
    >
      <Paper
        elevation={isMobile ? 0 : 3}
        square={isMobile}
        sx={{
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: { xs: 0, sm: 2 },
          height: { xs: "100%", sm: "auto" },
          width: "100%",
          boxSizing: "border-box",
          overflow: { xs: "auto", sm: "visible" },
          maxWidth: { sm: 450 },
          mx: "auto",
        }}
      >
        <Typography
          variant={isMobile ? (isVerySmallScreen ? "h5" : "h4") : "h4"}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
            mt: { xs: 1, sm: 0 },
            textAlign: "center",
          }}
        >
          건강도우미
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <AuthTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          emailLabel="이메일 로그인"
          googleLabel="소셜 로그인"
          sx={{ mb: 1 }}
        />

        {activeTab === 0 ? (
          // 이메일 로그인 폼
          <LoginForm
            onLogin={onLogin}
            loading={loading}
            error={error}
            sx={{ width: "100%" }}
          />
        ) : (
          // 소셜 로그인 폼
          <SocialLogin
            onGoogleLogin={onGoogleLogin}
            loading={loading}
            type="login"
            sx={{ width: "100%" }}
          />
        )}
      </Paper>
    </Container>
  );
};

export default Login;
