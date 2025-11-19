// 로그인 관련 타입 정의
export interface LoginRequest {
  id: string;
  pw: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export type Role = "ADMIN_MASTER" | "USER" | "GUEST" ;

// 사용자 정보 타입
export interface User {
  idx: number;
  id: string;
  uid: string;
  name: string;
  email: string;
  role: Role;
  team: {
    id: string;
    name: string;
    logo: string;
    tricode: string;
    sport: "LOL" | "VAL";
  } | null;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
}

// 인증 상태 관리 타입
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (accessToken: string, refreshToken?: string, user?: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}
