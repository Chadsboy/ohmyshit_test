import React, { ReactNode } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * 앱의 기본 레이아웃 컴포넌트
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            배변 기록 앱
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
