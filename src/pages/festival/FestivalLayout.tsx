import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header";
import BottomNav from "../../components/layout/BottomNav";

export default function FestivalLayout() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />

      <main className="pt-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
