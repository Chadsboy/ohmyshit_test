import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Person, Settings, Logout, Dashboard } from "@mui/icons-material";
import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";

interface UserMenuProps {
  settings?: string[];
  onLogout?: () => Promise<boolean>;
  userEmail?: string | null;
}

export const UserMenu = ({ onLogout, userEmail }: UserMenuProps) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItem = (setting: string) => {
    handleCloseUserMenu();

    // 각 메뉴 항목에 따른 경로로 이동
    if (setting === "Profile") {
      navigate("/profile");
    } else if (setting === "Dashboard") {
      navigate("/dashboard");
    } else if (setting === "Settings") {
      // 설정 페이지 경로가 있으면 추가
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      handleCloseUserMenu();
      await onLogout();
    }
  };

  // 아바타에 표시할 이니셜 생성
  const getInitials = () => {
    if (!userEmail) return "U";
    return userEmail.charAt(0).toUpperCase();
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title={userEmail || "사용자 메뉴"}>
        <IconButton
          onClick={handleOpenUserMenu}
          sx={{
            p: 0,
            "&:focus": {
              outline: "none",
            },
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main" }} alt={userEmail || "사용자"}>
            {getInitials()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {userEmail && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {userEmail}
            </Typography>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={() => handleMenuItem("Profile")}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="내 계정" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuItem("Dashboard")}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="대시보드" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuItem("Settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="설정" />
        </MenuItem>
        <Divider />
        {onLogout && (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="로그아웃" />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
