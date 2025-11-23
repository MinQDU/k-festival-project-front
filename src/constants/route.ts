export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FESTIVAL: "/festival",
  FESTIVALDETAIL: "/festival/:id",
  REVIEW: "/festival/review",
  JOB: "/festival/job",
} as const;

// 타입 정의
export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];
