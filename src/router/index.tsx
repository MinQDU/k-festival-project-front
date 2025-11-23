import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import FestivalPage from "../pages/festival/FestivalPage";
import FestivalDetailPage from "../components/festival/FestivalDetailPage";
import FestivalLayout from "../pages/festival/FestivalLayout";
import AuthGuard from "../components/common/AuthGuard";
import SignupPage from "../pages/login/SignupPage";
import LoginPage from "../pages/login/LoginPage";
import { ROUTES } from "../constants/route";
import JobPage from "../pages/festival/JobPage";
import ReviewPage from "../pages/festival/ReviewPage";
import MainPage from "../pages/festival/MainPage";

export const router = createBrowserRouter([
  // ================================
  // 1) 로그인 없어도 접근 가능 (공개 페이지)
  // ================================
  {
    path: "/festival",
    element: <FestivalLayout />,
    children: [{ index: true, element: <FestivalPage /> }],
  },
  {
    path: "/festival/:id",
    element: <FestivalLayout />,
    children: [{ index: true, element: <FestivalDetailPage /> }],
  },
  {
    path: "/review",
    element: <FestivalLayout />,
    children: [
      {
        index: true,
        element: <ReviewPage />,
      },
    ],
  },
  {
    path: "/job",
    element: <FestivalLayout />,
    children: [
      {
        index: true,
        element: <JobPage />,
      },
    ],
  },

  // ================================
  // 2) 홈 → festival 로 이동 (공개)
  // ================================
  {
    path: "/",
    element: <FestivalLayout />,
    children: [{ index: true, element: <MainPage /> }],
  },

  // ================================
  // 3) 로그인 / 회원가입 (공개)
  // ================================
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignupPage />,
  },

  // ================================
  // 4) 인증 필요한 App (LOL / VAL / ADMIN)
  // ================================
  {
    path: "/app",
    element: (
      <AuthGuard>
        <App />
      </AuthGuard>
    ),
    children: [
      // 여기 아래에 LOL, VAL, ADMIN 라우트들 넣으면 됨
    ],
  },
]);
