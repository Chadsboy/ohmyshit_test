import { Box } from "@mui/material";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface MainProps {
  children: ReactNode;
}

export const Main = ({ children }: MainProps) => {
  const location = useLocation();

  // '/' 페이지와 '/calendar' 페이지에서만 스크롤 비활성화
  const isScrollDisabled =
    location.pathname === "/" || location.pathname === "/calendar";

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: "100%",
        marginTop: "64px",
        paddingBottom: "76px",
        p: { xs: 2, sm: 3 },
        position: "relative",
        // 특정 페이지에서만 스크롤 비활성화 적용
        overflow: isScrollDisabled ? "hidden" : "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
