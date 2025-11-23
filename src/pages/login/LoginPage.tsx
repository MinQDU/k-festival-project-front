import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../../services/auth";
import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../constants/route";
import InfoModal from "../../components/common/InfoModal";

// 사용자 로그인 페이지
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestBlockModal, setShowGuestBlockModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useAuthStore();

  const isLoginEnabled = username.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoginEnabled || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");
    setLoading(true);

    try {
      await login({ id: username, pw: password });
      const from = location.state?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    } catch (error) {
      console.log("로그인 에러:", error);

      // GUEST 사용자 차단 처리
      if (error instanceof Error && error.message === "GUEST_USER_BLOCKED") {
        setShowGuestBlockModal(true);
        return;
      }

      const errorObj = error as {
        message?: string;
        response?: { data?: { message?: string } };
      };

      const errorMessage =
        errorObj?.response?.data?.message || errorObj?.message || "로그인 중 오류가 발생했습니다.";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <img
            src="/assets/logo192.png"
            alt="K FESTIVAL"
            className="mx-auto mb-4"
            style={{
              width: "clamp(1rem, 4vw, 8rem)",
              height: "auto",
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-black">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="아이디를 입력해주세요"
              disabled={isLoading}
              className="w-[clamp(16rem,25vw,20rem)] border border-[#3E4652] bg-gray-200 px-4 py-3 text-black placeholder-[#6B7280] transition-colors focus:border-[#A8C7FE] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호를 입력해주세요"
              disabled={isLoading}
              className="w-[clamp(16rem,25vw,20rem)] border border-[#3E4652] bg-gray-200 px-4 py-3 text-black placeholder-[#6B7280] transition-colors focus:border-[#A8C7FE] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!isLoginEnabled || isLoading}
            className={`w-[clamp(16rem,25vw,20rem)] rounded-lg px-4 py-3 font-medium transition-colors ${
              isLoginEnabled && !isLoading
                ? "cursor-pointer bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-md hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
                : "cursor-not-allowed bg-blue-200 text-[#6B7280]"
            }`}
          >
            {isLoading ? "로그인 중..." : "LOGIN"}
          </button>

          {errorMessage && (
            <div className="max-w-[clamp(16rem,25vw,20rem)] text-center text-sm text-red-500">
              {"아이디와 비밀번호를 다시 확인해주세요."}
            </div>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-400">계정이 없으신가요? </span>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SIGNUP)}
              className="text-sm text-[#A8C7FE] transition-colors hover:text-[#8BB4FE] hover:underline"
            >
              회원가입
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          {/*홈 화면 으로 이동 */}
          <button
            type="button"
            onClick={() => navigate(ROUTES.HOME)}
            className="cursor-pointer rounded-lg bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 p-2 shadow-md hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
          >
            홈으로
          </button>
        </div>
      </div>

      {/* GUEST 사용자 차단 모달 */}
      <InfoModal
        isOpen={showGuestBlockModal}
        onClose={() => setShowGuestBlockModal(false)}
        title="로그인 제한"
        content="GUEST 사용자는 로그인이 제한됩니다.<br />관리자 승인 후 로그인이 가능합니다."
        confirmText="확인"
        onConfirm={() => setShowGuestBlockModal(false)}
      />
    </div>
  );
}
