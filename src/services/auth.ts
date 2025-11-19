import { axios } from "./axios";
import type { LoginRequest, LoginResponse, User } from "../types/auth";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// 로그인
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/app/user/login`,
    credentials
  );
  const { accessToken, refreshToken } = response.data;

  // 저장된 토큰으로 사용자 정보 가져오기
  try {
    const userInfo = await getProfile(accessToken);

    // role 체크 추가
    if (userInfo.role === "GUEST") {
      throw new Error("GUEST_USER_BLOCKED");
    }

    // 정상 사용자만 토큰과 정보 저장
    updateTokens(accessToken, refreshToken, userInfo);
  } catch (error) {
    if (error instanceof Error && error.message === "GUEST_USER_BLOCKED") {
      throw error; // GUEST 에러는 다시 던지기
    }
    console.warn("사용자 정보 가져오기 실패:", error);
    // 프로필 가도져오기 실패해 로그인은 성공으로 처리 (토큰만 저장)
    updateTokens(accessToken, refreshToken);
  }

  return response.data;
};

// 프로필 조회(자신)
export const getProfile = (accessToken: string) =>
  axios
    .get<User>(`${API_BASE_URL}/app/user/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data);

// 토큰 업데이트 (스토어 + localStorage)
export const updateTokens = (
  accessToken: string,
  refreshToken?: string,
  user?: User
) => {
  const { setTokens } = useAuthStore.getState();
  setTokens(accessToken, refreshToken, user);
};

// 로그아웃
export const logoutUser = (navigate?: (path: string) => void): void => {
  const { logout } = useAuthStore.getState();
  logout();

  if (navigate) {
    navigate("/login");
  } else {
    // fallback: navigate가 없으면 기존 방식 사용
    window.location.href = "/login";
  }
};

// 토큰 가져오기
export const getTokens = () => {
  const { accessToken, refreshToken } = useAuthStore.getState();
  return { accessToken, refreshToken };
};

// 회원가입
export const signUp = async (signUpData: {
  id: string;
  pw: string;
  email: string;
  name: string;
  termsOfService: boolean;
  privacyPolicy: boolean;
  alertPolicy: boolean;
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/app/user/sign-up`,
    signUpData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
