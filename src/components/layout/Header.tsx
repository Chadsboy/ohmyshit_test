import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AdbIcon from "@mui/icons-material/Adb";
import { useThemeContext } from "../../theme/ThemeContext";
import { MaterialUISwitch } from "./ThemeSwitch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { HeaderMenu } from "./HeaderMenu";
import { UserMenu } from "./UserMenu";
import { useAuth } from "../../hooks/useAuth";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

interface HeaderProps {
  title?: string;
}

export const Header = ({ title = "LOGO" }: HeaderProps) => {
  const { mode, toggleTheme } = useThemeContext();
  const { user, handleLogout } = useAuth();

  // 사용자 이메일 가져오기
  const userEmail = user?.email || null;
  // 사용자 아바타 URL 가져오기
  const avatarUrl = user?.avatar_url || null;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        boxShadow: 1,
        left: 0,
        right: 0,
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* 데스크톱 로고 */}
        <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {title}
        </Typography>

        {/* 네비게이션 메뉴 */}
        <HeaderMenu pages={pages} />

        {/* 모바일 로고 */}
        <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {title}
        </Typography>

        {/* 테마 스위치와 사용자 메뉴 */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            control={
              <MaterialUISwitch
                checked={mode === "dark"}
                onChange={toggleTheme}
                sx={{
                  "&:focus": {
                    outline: "none",
                  },
                  mx: 1,
                }}
              />
            }
            label=""
            sx={{ mb: 0, mr: 1 }}
          />

          <UserMenu
            settings={settings}
            onLogout={handleLogout}
            userEmail={userEmail}
            avatarUrl={avatarUrl}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
