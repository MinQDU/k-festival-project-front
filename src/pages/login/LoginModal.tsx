import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";

export default function LoginModal() {
  const navigate = useNavigate();

  const closeModal = () => navigate("/");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={closeModal}
    >
      <div className="rounded-xl bg-[#0C1524] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <LoginPage />
      </div>
    </div>
  );
}
