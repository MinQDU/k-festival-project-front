export const HEADER_CONSTANTS = {
  LOGO_TEXT: "K FESTIVAL",
  NAVIGATION: {
    HOME: "Home",
  },
} as const;

// 타입 정의
export type NavigationKeys = keyof typeof HEADER_CONSTANTS.NAVIGATION;
