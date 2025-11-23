import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "../../constants/route";
import { useAuthStore } from "../../stores/authStore";
import { logoutUser, getProfile } from "../../services/auth";
import SearchBar from "./SearchBar";

// 애플리케이션의 메인 헤더 컴포넌트
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, accessToken, setTokens } = useAuthStore();

  useEffect(() => {
    const refreshUserInfo = async () => {
      if (isAuthenticated && accessToken && !user?.name) {
        try {
          const userInfo = await getProfile(accessToken);
          setTokens(accessToken, undefined, userInfo);
        } catch (error) {
          console.error("사용자 정보 갱신 실패:", error);
          logoutUser(navigate);
        }
      }
    };

    refreshUserInfo();
  }, [isAuthenticated, accessToken, user?.name, setTokens, navigate]);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const getActiveColor = (path: string) => {
    return isActivePath(path) ? "#B8CBF1" : "white";
  };

  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-md">
      <div className="flex items-center gap-3 px-4 py-1">
        <div className="logo">
          <a
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-xl font-bold text-white no-underline transition-colors"
            style={{
              color: getActiveColor(ROUTES.HOME),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#B8CBF1";
            }}
          >
            <img src="/assets/logo192.png" alt="K Festival Logo" className="w-8" />
          </a>
        </div>
        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white">
                {user?.name || user?.id || "사용자"}님 환영합니다
              </span>
              <button
                onClick={() => logoutUser(navigate)}
                className="shrink-0 rounded-lg bg-[#FF4655] px-3 py-2 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-[#E63946]"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="rounded-lg bg-[#0F079F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0D0680]"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
