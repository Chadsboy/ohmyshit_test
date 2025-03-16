import { ReactNode } from "react";

export interface NavigationItemType {
  label: string;
  icon: ReactNode;
  value: string;
}

// 네비게이션 아이템 값 상수
export const NAV_HOME = "home";
export const NAV_SEARCH = "search";
export const NAV_EXPLORE = "explore";
export const NAV_CHAT = "chat";
export const NAV_CALENDAR = "calendar";
