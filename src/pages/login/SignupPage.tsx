import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/route";
import { signUp } from "../../services/auth";
import InfoModal from "../../components/common/InfoModal";

export default function SignupPage() {
  const navigate = useNavigate();

  // 입력 필드
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 약관 동의
  const [termsOfService, setTermsOfService] = useState(true);
  const [privacyPolicy, setPrivacyPolicy] = useState(true);
  const [alertPolicy, setAlertPolicy] = useState(true);

  // 상태
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 유효성 검사 상태
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    name: false,
    email: false,
  });

  // 유효성 검사 함수
  const validateUsername = (v: string) => !v.includes("!");
  const validatePassword = (v: string) => v.length >= 8;
  const validateEmail = (v: string) => /\S+@\S+\.\S+/.test(v);
  const validateName = () => true;

  // 필드별 에러 업데이트
  const updateFieldError = (field: keyof typeof fieldErrors, value: string) => {
    let isValid = false;

    switch (field) {
      case "username":
        isValid = validateUsername(value);
        break;
      case "password":
        isValid = validatePassword(value);
        break;
      case "confirmPassword":
        isValid = value === password && value.length > 0;
        break;
      case "email":
        isValid = validateEmail(value);
        break;
      case "name":
        isValid = validateName();
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: !isValid && value.length > 0,
    }));
  };

  // 버튼 활성화
  const isSignupEnabled =
    username.trim().length > 0 &&
    password.length >= 8 &&
    confirmPassword === password &&
    name.trim().length > 0 &&
    validateEmail(email) &&
    !Object.values(fieldErrors).some((e) => e);

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignupEnabled || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      await signUp({
        id: username,
        pw: password,
        email: email,
        name: name,
        termsOfService,
        privacyPolicy,
        alertPolicy,
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.log("회원가입 에러:", error);
      let errorMsg = "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        const serverMessage = axiosError.response?.data?.message;

        if (serverMessage) errorMsg = serverMessage;
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit(e);
  };

  const handleSuccessConfirm = () => {
    navigate(ROUTES.LOGIN, {
      state: {
        message: "권한 요청이 완료되었습니다. 관리자 인증 후 로그인해주세요.",
      },
    });
  };

  return (
    <div className="w-[380px]">
      <div className="w-full max-w-lg px-6">
        <div className="mt-10 mb-8 text-center">
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

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-8">
          {/* 아이디 */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex max-w-[clamp(20rem,30vw,24rem)] items-center gap-4">
              <label className="w-20 text-sm font-medium text-white">아이디</label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v.includes("!")) setUsername(v);
                }}
                onBlur={(e) => updateFieldError("username", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="아이디를 입력해주세요"
                disabled={isLoading}
                className="flex-1 border border-[#3E4652] bg-[#1A2332] px-4 py-3 text-white placeholder-[#6B7280] focus:border-[#A8C7FE] focus:outline-none"
              />
            </div>
            <p
              className={`ml-24 text-xs ${fieldErrors.username ? "text-red-400" : "text-gray-400"}`}
            >
              아이디를 입력해주세요. (! 문자는 사용할 수 없습니다)
            </p>
          </div>

          {/* 비밀번호 */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex max-w-[clamp(20rem,30vw,24rem)] items-center gap-4">
              <label className="w-20 text-sm font-medium text-white">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={(e) => updateFieldError("password", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호를 입력해주세요"
                disabled={isLoading}
                className="flex-1 border border-[#3E4652] bg-[#1A2332] px-4 py-3 text-white placeholder-[#6B7280] focus:border-[#A8C7FE] focus:outline-none"
              />
            </div>
            <p
              className={`ml-24 text-xs ${fieldErrors.password ? "text-red-400" : "text-gray-400"}`}
            >
              비밀번호는 8자리 이상이어야 합니다.
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex max-w-[clamp(20rem,30vw,24rem)] items-center gap-4">
              <label className="w-20 text-sm font-medium text-white">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={(e) => updateFieldError("confirmPassword", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="비밀번호를 다시 입력해주세요"
                disabled={isLoading}
                className={`flex-1 border bg-[#1A2332] px-4 py-3 text-white placeholder-[#6B7280] focus:border-[#A8C7FE] focus:outline-none ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-500"
                    : "border-[#3E4652]"
                }`}
              />
            </div>
            {confirmPassword && (
              <p
                className={`ml-24 text-xs ${
                  password === confirmPassword ? "text-blue-400" : "text-red-400"
                }`}
              >
                {password === confirmPassword
                  ? "비밀번호가 일치합니다"
                  : "비밀번호가 일치하지 않습니다"}
              </p>
            )}
          </div>

          {/* 이름 */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex max-w-[clamp(20rem,30vw,24rem)] items-center gap-4">
              <label className="w-20 text-sm font-medium text-white">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => updateFieldError("name", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="이름을 입력해주세요"
                disabled={isLoading}
                className="flex-1 border border-[#3E4652] bg-[#1A2332] px-4 py-3 text-white placeholder-[#6B7280] focus:border-[#A8C7FE] focus:outline-none"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex max-w-[clamp(20rem,30vw,24rem)] items-center gap-4">
              <label className="w-20 text-sm font-medium text-white">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => updateFieldError("email", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="이메일을 입력해주세요"
                disabled={isLoading}
                className="flex-1 border border-[#3E4652] bg-[#1A2332] px-4 py-3 text-white placeholder-[#6B7280] focus:border-[#A8C7FE] focus:outline-none"
              />
            </div>
            <p className={`ml-24 text-xs ${fieldErrors.email ? "text-red-400" : "text-gray-400"}`}>
              올바른 이메일 주소를 입력해주세요.
            </p>
          </div>

          {/* 약관 동의 체크박스 */}
          <div className="flex w-full max-w-[clamp(20rem,30vw,24rem)] flex-col gap-3 text-white">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={termsOfService}
                onChange={(e) => setTermsOfService(e.target.checked)}
              />
              이용약관 동의
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.checked)}
              />
              개인정보 처리방침 동의
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={alertPolicy}
                onChange={(e) => setAlertPolicy(e.target.checked)}
              />
              안내 알림 동의
            </label>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!isSignupEnabled || isLoading}
            className={`w-[clamp(6rem,25vw,11rem)] rounded-3xl px-4 py-3 font-medium transition-colors ${
              isSignupEnabled && !isLoading
                ? "cursor-pointer bg-[#0F079F] text-white hover:bg-[#0D0680]"
                : "cursor-not-allowed bg-[#374151] text-[#6B7280]"
            }`}
          >
            {isLoading ? "권한 요청 중..." : "권한 요청하기"}
          </button>

          {errorMessage && (
            <div className="max-w-[clamp(16rem,25vw,20rem)] text-center text-sm text-red-500">
              {errorMessage}
            </div>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-400">이미 계정이 있으신가요? </span>
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-sm text-[#A8C7FE] hover:text-[#8BB4FE] hover:underline"
            >
              로그인
            </button>
          </div>
        </form>
      </div>

      <InfoModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="호출 완료"
        content="회원가입 완료되었습니다. 로그인 해주세요."
        confirmText="확인"
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
}
