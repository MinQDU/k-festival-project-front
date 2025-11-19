import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../constants/route";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, isAuthenticated, initialize } = useAuthStore();

  // 로그인/회원가입 페이지는 AuthGuard 제외
  const publicPaths = [ROUTES.LOGIN, ROUTES.SIGNUP];
  const isPublicPage = publicPaths.includes(location.pathname as typeof publicPaths[number]);

  useEffect(() => {
    const validateAuth = async () => {
      if (isPublicPage) return; // 🔥 public 페이지는 아무 검사 안 함

      // 1) 토큰 있는데 스토어 초기화 안 된 경우
      if (accessToken && !isAuthenticated) {
        try {
          await initialize();
          return;
        } catch (err) {
          navigate(ROUTES.LOGIN, { replace: true });
          return;
        }
      }

      // 2) 토큰이 없음 → 보호 페이지 접근
      if (!accessToken) {
        navigate(ROUTES.LOGIN, {
          replace: true,
          state: { from: location },
        });
      }
    };

    validateAuth();
  }, [
    accessToken,
    isAuthenticated,
    initialize,
    location.pathname, // 🔥 pathname만 감시 (절대 navigate 무한 루프 안 생김)
    isPublicPage,
    navigate,
  ]);

  // public 페이지면 그대로 children 렌더
  if (isPublicPage) return <>{children}</>;

  // 보호 페이지는 인증이 만족될 때만 렌더
  if (!accessToken) {
    return null; // 잠깐 빈화면 (navigate 직전)
  }

  if (accessToken && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C1524] flex items-center justify-center">
        <p className="text-white">인증 확인 중...</p>
      </div>
    );
  }

  return <>{children}</>;
}
