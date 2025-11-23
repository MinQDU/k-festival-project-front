import { ROUTES } from "../constants/route";

export function handleApiError(err: any, navigate: any) {
  if (err?.response?.status === 401) {
    alert("로그인이 필요합니다.");
    navigate(ROUTES.LOGIN);
    return;
  }
}