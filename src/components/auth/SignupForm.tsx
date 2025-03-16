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
  PersonAdd,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";

interface SignupFormProps {
  onSignup: (email: string, password: string, name: string) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
  sx?: SxProps<Theme>;
}

/**
 * 회원가입 폼 컴포넌트
 */
const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  loading,
  error,
  sx,
}) => {
  const isVerySmallScreen = useMediaQuery("(max-width:350px)");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword()) return;
    if (!agreeTerms) return;

    await onSignup(email, password, name);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={sx}>
      {error && (
        <Alert severity="error" sx={{ mb: 1.5, width: "100%" }}>
          {error.message}
        </Alert>
      )}

      {passwordError && (
        <Alert severity="error" sx={{ mb: 1.5, width: "100%" }}>
          {passwordError}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="이름"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{
          mb: 1.5,
          "& .MuiInputBase-root": {
            height: isVerySmallScreen ? "45px" : "50px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="이메일 주소"
        name="email"
        autoComplete="email"
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
        autoComplete="new-password"
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

      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="비밀번호 확인"
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={validatePassword}
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
                aria-label="toggle confirm password visibility"
                onClick={toggleConfirmPasswordVisibility}
                edge="end"
                size="small"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            value="agree"
            color="primary"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
            size={isVerySmallScreen ? "small" : "medium"}
          />
        }
        label={
          <Box
            component="span"
            sx={{
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Link
              component={RouterLink}
              to="/terms"
              variant="body2"
              sx={{ fontSize: isVerySmallScreen ? "0.7rem" : "0.85rem" }}
            >
              이용약관
            </Link>
            <Typography
              variant={isVerySmallScreen ? "body2" : "body1"}
              component="span"
              sx={{
                fontSize: isVerySmallScreen ? "0.7rem" : "0.85rem",
                ml: 0.5,
              }}
            >
              에 동의합니다.
            </Typography>
          </Box>
        }
        sx={{ mb: 1.5 }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        startIcon={<PersonAdd />}
        disabled={loading || !agreeTerms}
        sx={{
          mb: 2,
          py: 1,
          height: isVerySmallScreen ? "45px" : "50px",
          fontSize: isVerySmallScreen ? "0.875rem" : "1rem",
        }}
      >
        {loading ? "회원가입 중..." : "회원가입"}
      </Button>

      <Stack
        justifyContent="center"
        sx={{
          mt: 1,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Link
          component={RouterLink}
          to="/login"
          variant="body2"
          sx={{
            fontSize: isVerySmallScreen ? "0.75rem" : "0.875rem",
            display: "block",
          }}
        >
          이미 계정이 있으신가요? 로그인
        </Link>
      </Stack>
    </Box>
  );
};

export default SignupForm;
