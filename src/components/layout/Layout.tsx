import { Box } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Main } from "./Main";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  value: string;
  onChange: (value: string) => void;
  items?: {
    label: string;
    icon: ReactNode;
    value: string;
  }[];
  title?: string;
}

export const Layout = ({
  children,
  value,
  onChange,
  items,
  title,
}: LayoutProps) => {
  const location = useLocation();

  // '/' 페이지와 '/calendar' 페이지에서만 스크롤 비활성화
  const isScrollDisabled =
    location.pathname === "/" || location.pathname === "/calendar";

  // html, body, #root 요소의 overflow 속성 제어
  useEffect(() => {
    const htmlElement = document.documentElement;
    const rootElement = document.getElementById("root");

    if (isScrollDisabled) {
      document.body.style.overflow = "hidden";
      if (htmlElement) htmlElement.style.overflow = "hidden";
      if (rootElement) rootElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      if (htmlElement) htmlElement.style.overflow = "auto";
      if (rootElement) rootElement.style.overflow = "auto";
    }

    // 컴포넌트 언마운트 시 원래 상태로 복원
    return () => {
      document.body.style.overflow = "auto";
      if (htmlElement) htmlElement.style.overflow = "auto";
      if (rootElement) rootElement.style.overflow = "auto";
    };
  }, [isScrollDisabled]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        overflow: isScrollDisabled ? "hidden" : "auto",
        position: "relative",
      }}
    >
      {/* 헤더 */}
      <Header title={title || "건강도우미"} />

      {/* 메인 콘텐츠 */}
      <Main>{children}</Main>

      {/* 푸터 */}
      <Footer value={value} onChange={onChange} items={items} />
    </Box>
  );
};
