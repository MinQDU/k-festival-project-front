import axios from "axios";
import { useAuthStore } from "../stores/authStore";

// axios 인스턴스 생성
const axiosInstance = axios.create();

// 중복 로그아웃/리다이렉트를 방지하기 위한 가드
let isLoggingOut = false;

// 토큰 갱신 함수
const refreshAccessToken = async (): Promise<string> => {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axiosInstance.post(
    `${import.meta.env.VITE_API_URL}/app/user/refresh-token`,
    {
      refreshToken,
    }
  );

  const { accessToken } = response.data;
  const { setTokens } = useAuthStore.getState();
  setTokens(accessToken);
  return accessToken;
};

// 로그아웃 함수 (중복 호출 가드 포함)
const logoutUser = (): void => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  const { logout } = useAuthStore.getState();
  logout();
  window.location.href = "/login";
};

export const setupAxiosInterceptors = () => {
  // 요청 인터셉터: accessToken 자동 삽입 (백엔드 API에만)
  axiosInstance.interceptors.request.use((config) => {
    // 백엔드 API에만 토큰 추가 (외부 API는 제외)
    if (config.url?.includes(import.meta.env.VITE_API_URL)) {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // 응답 인터셉터: 401 시 토큰 갱신
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401) {
        const { refreshToken, accessToken } = useAuthStore.getState();

        // 리프레시 토큰이 있는 경우에만 재시도
        if (!originalRequest._retry && refreshToken) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch {
            // 기존에 로그인된 상태였다면 로그아웃, 아니면 조용히 실패 반환
            if (accessToken) logoutUser();
            return Promise.reject(error);
          }
        }

        if (!refreshToken) {
          // 과거에 로그인된 적이 있고 accessToken만 남아있다면 정리
          if (accessToken) logoutUser();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

// 인터셉터가 적용된 axios 인스턴스 export
export { axiosInstance as axios };
