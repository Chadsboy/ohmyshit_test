import React from "react";
import { Button, IconButton, SxProps, Theme, Tooltip } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

interface LogoutButtonProps {
  onLogout: () => Promise<boolean>;
  variant?: "text" | "outlined" | "contained" | "icon";
  label?: string;
  tooltip?: string;
  sx?: SxProps<Theme>;
}

/**
 * 로그아웃 기능을 제공하는 버튼 컴포넌트
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  variant = "text",
  label = "로그아웃",
  tooltip = "로그아웃",
  sx,
}) => {
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  // 아이콘 버튼 렌더링
  if (variant === "icon") {
    return (
      <Tooltip title={tooltip}>
        <IconButton
          onClick={handleLogout}
          color="inherit"
          aria-label={label}
          sx={sx}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    );
  }

  // 일반 버튼 렌더링
  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      sx={sx}
    >
      {label}
    </Button>
  );
};

export default LogoutButton;
