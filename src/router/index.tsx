import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginModal from "../pages/login/LoginModal";
import SignupModal from "../pages/login/SignupModal";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <LoginModal />,
      },
      {
        path: "signup",
        element: <SignupModal />,
      },
    ],
  },
]);
