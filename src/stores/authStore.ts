import { create } from "zustand";
import type { AuthState, User } from "../types/auth";
import { getProfile } from "../services/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: false,
  isLoading: false,

  // 로그인 성공 시 토큰과 사용자 정보 설정
  setTokens: (accessToken: string, refreshToken?: string, user?: User) => {
    set({
      accessToken,
      refreshToken: refreshToken ?? localStorage.getItem("refreshToken") ?? null,
      user: user ?? null,
      isAuthenticated: true,
    });

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  },

  // 로그아웃 시 모든 인증 정보 제거
  logout: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // 저장된 토큰으로 사용자 정보 가져오기 및 자동 로그인
  initialize: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      try {
        const userInfo = await getProfile(accessToken);

        set({
          user: userInfo,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        throw error;
      }
    }
  },
}));
