import React from "react";
import {
  Tabs,
  Tab,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Email, Google } from "@mui/icons-material";

interface AuthTabsProps {
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  emailLabel?: string;
  googleLabel?: string;
  sx?: SxProps<Theme>;
}

/**
 * 인증 화면에서 이메일 및 소셜 로그인 탭을 표시하는 컴포넌트
 */
const AuthTabs: React.FC<AuthTabsProps> = ({
  activeTab,
  handleTabChange,
  emailLabel = "이메일",
  googleLabel = "소셜 로그인",
  sx,
}) => {
  const isVerySmallScreen = useMediaQuery("(max-width:350px)");

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      variant="fullWidth"
      TabIndicatorProps={{
        style: {
          height: 3,
          borderRadius: 3,
        },
      }}
      sx={{
        mb: 2,
        width: "100%",
        "& .MuiTab-root": {
          padding: 1.5,
          minHeight: isVerySmallScreen ? "45px" : "50px",
          "&:focus": {
            outline: "none",
          },
          "&.Mui-focusVisible": {
            outline: "none",
          },
          "& .MuiTab-iconWrapper": {
            marginBottom: 0.5,
          },
        },
        ...sx,
      }}
    >
      <Tab
        icon={<Email />}
        iconPosition="start"
        label={
          isVerySmallScreen ? null : (
            <Typography variant="body2">{emailLabel}</Typography>
          )
        }
        aria-label={emailLabel}
        disableFocusRipple
        disableRipple
        sx={{
          "&:focus": {
            outline: "none",
          },
        }}
      />
      <Tab
        icon={<Google />}
        iconPosition="start"
        label={
          isVerySmallScreen ? null : (
            <Typography variant="body2">{googleLabel}</Typography>
          )
        }
        aria-label={googleLabel}
        disableFocusRipple
        disableRipple
        sx={{
          "&:focus": {
            outline: "none",
          },
        }}
      />
    </Tabs>
  );
};

export default AuthTabs;
