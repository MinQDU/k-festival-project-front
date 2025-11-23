import Header from "./components/layout/Header";
import { Outlet } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FestivalPage from "../src/pages/festival/FestivalPage";
import BottomNav from "./components/layout/BottomNav";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize(); // 앱 시작 시 자동 로그인 복구
  }, [initialize]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#181818" }}>
      <Header />
      <main className="flex1">
        <Outlet />
        <FestivalPage />
      </main>
      <ToastContainer aria-label="toast-container" />
      <BottomNav />
    </div>
  );
}

export default App;
