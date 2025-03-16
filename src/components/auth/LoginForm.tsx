import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Box,
  Typography,
  Alert,
  SxProps,
  Theme,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
  sx?: SxProps<Theme>;
}

/**
 * 이메일 로그인 폼 컴포넌트
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  loading,
  error,
  sx,
}) => {
  const isVerySmallScreen = useMediaQuery("(max-width:350px)");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={sx}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          {error.message}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="이메일 주소"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          mb: 1.5,
          "& .MuiInputBase-root": {
            height: isVerySmallScreen ? "45px" : "50px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          mb: 1.5,
          "& .MuiInputBase-root": {
            height: isVerySmallScreen ? "45px" : "50px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={togglePasswordVisibility}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            value="remember"
            color="primary"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            size={isVerySmallScreen ? "small" : "medium"}
          />
        }
        label={
          <Typography variant={isVerySmallScreen ? "body2" : "body1"}>
            로그인 상태 유지
          </Typography>
        }
        sx={{ mb: 1.5 }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        startIcon={<LoginIcon />}
        disabled={loading}
        sx={{
          mb: 2,
          py: 1,
          height: isVerySmallScreen ? "45px" : "50px",
          fontSize: isVerySmallScreen ? "0.875rem" : "1rem",
        }}
      >
        {loading ? "로그인 중..." : "로그인"}
      </Button>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={1}
        sx={{
          mt: 1,
          width: "100%",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Link
          component={RouterLink}
          to="/forgot-password"
          variant="body2"
          sx={{
            fontSize: isVerySmallScreen ? "0.75rem" : "0.875rem",
            display: "block",
          }}
        >
          비밀번호를 잊으셨나요?
        </Link>
        <Link
          component={RouterLink}
          to="/signup"
          variant="body2"
          sx={{
            fontSize: isVerySmallScreen ? "0.75rem" : "0.875rem",
            display: "block",
          }}
        >
          계정이 없으신가요? 회원가입
        </Link>
      </Stack>
    </Box>
  );
};

export default LoginForm;
