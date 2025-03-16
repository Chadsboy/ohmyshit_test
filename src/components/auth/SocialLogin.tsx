import React from "react";
import {
  Button,
  Divider,
  Box,
  Typography,
  SxProps,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { Google } from "@mui/icons-material";

interface SocialLoginProps {
  onGoogleLogin: () => Promise<boolean>;
  loading: boolean;
  type?: "login" | "signup";
  sx?: SxProps<Theme>;
}

/**
 * 소셜 로그인 버튼을 제공하는 컴포넌트
 */
const SocialLogin: React.FC<SocialLoginProps> = ({
  onGoogleLogin,
  loading,
  type = "login",
  sx,
}) => {
  const isVerySmallScreen = useMediaQuery("(max-width:350px)");

  const handleGoogleLogin = async () => {
    await onGoogleLogin();
  };

  const actionText = type === "login" ? "로그인" : "회원가입";

  return (
    <Box sx={sx}>
      <Divider sx={{ mb: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ px: 1, fontSize: isVerySmallScreen ? "0.75rem" : "0.875rem" }}
        >
          또는
        </Typography>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<Google sx={{ color: "#DB4437" }} />}
        onClick={handleGoogleLogin}
        disabled={loading}
        sx={{
          mb: 2,
          py: 1,
          height: isVerySmallScreen ? "45px" : "50px",
          fontSize: isVerySmallScreen ? "0.875rem" : "1rem",
          borderColor: "#4285F4",
          color: "#4285F4",
          "&:hover": {
            borderColor: "#357ae8",
            backgroundColor: "rgba(66, 133, 244, 0.04)",
          },
        }}
      >
        {loading ? `${actionText} 중...` : `Google로 ${actionText}`}
      </Button>
    </Box>
  );
};

export default SocialLogin;
