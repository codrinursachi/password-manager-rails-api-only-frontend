import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import LoginPage from "./pages/Login";
import LoginsPage from "./pages/Logins";
import { useState } from "react";
import RootLayout from "./pages/RootLayout";
import RegisterPage from "./pages/Register";
import TrashPage from "./pages/Trash";
import SharedLoginsPage from "./pages/SharedLogins";
import LoginViewPage from "./pages/LoginView";
import NewLoginPage from "./pages/NewLogin";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout isLoggedIn={isLoggedIn} />,
      children: [
        { index: true, element: <LoginsPage /> },
        {
          path: "logins/:loginId",
          element: <LoginViewPage />,
        },
        {
          path: "new-login-page",
          element: <NewLoginPage />,
        },
        {
          path: "shared-logins",
          element: <SharedLoginsPage />,
        },
        { path: "trash", element: <TrashPage /> },
      ],
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
