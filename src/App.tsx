import Header from "./components/layout/Header";
import { Outlet } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FestivalPage from "../src/pages/festival/FestivalPage";

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#181818" }}>
      <Header />
      <main className="flex1">
        <Outlet />
        <FestivalPage />
      </main>
      <ToastContainer aria-label="toast-container" />
    </div>
  );
}

export default App;
