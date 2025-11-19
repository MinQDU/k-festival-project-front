export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

// 타입 정의
export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];
