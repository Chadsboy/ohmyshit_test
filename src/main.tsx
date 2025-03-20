import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeContextProvider } from "./theme/ThemeContext";

createRoot(document.getElementById("root")!).render(
  // StrictMode 일시적으로 비활성화 - 문제 해결 후 다시 활성화하세요
  // <StrictMode>
  <ThemeContextProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
  </ThemeContextProvider>
  // </StrictMode>
);
