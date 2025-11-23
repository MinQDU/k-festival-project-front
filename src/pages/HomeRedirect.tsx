import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/route";

export default function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // 원하는 기본 리다이렉트 경로 설정
    navigate(ROUTES.HOME, { replace: true });
  }, [navigate]);

  return null; // 화면에는 아무것도 렌더하지 않음
}
