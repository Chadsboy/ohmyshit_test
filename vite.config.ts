import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@mui/x-date-pickers": "@mui/x-date-pickers",
    },
  },
  optimizeDeps: {
    include: ["@mui/x-date-pickers", "dayjs"],
  },
});
