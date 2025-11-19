import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router/index.tsx";
import { setupAxiosInterceptors } from "./services/axios";
import "./index.css";
if (import.meta.env.DEV) {
  import("@locator/runtime");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

// 앱 시작 시 데이터 초기화
const initializeApp = async () => {
  try {
    console.log("데이터 초기화 중...");

    // Axios 인터셉터 설정 (토큰 자동 갱신)
    setupAxiosInterceptors();

    console.log("데이터 초기화 완료");
  } catch (error) {
    console.error("데이터 초기화 실패:", error);
  }
};

// 앱 렌더링 전에 초기화 실행
initializeApp().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
