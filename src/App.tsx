import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import LoginsPage from "./pages/LoginsPage";
import { useState } from "react";
import RootLayout from "./pages/RootLayout";
import RegisterPage from "./pages/RegisterPage";
import TrashPage from "./pages/TrashPage";
import SharedLoginsPage from "./pages/SharedLoginsPage";
import LoginViewPage from "./pages/LoginViewPage";
import NewLoginPage from "./pages/NewLoginPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <LoginsPage isLoggedIn={isLoggedIn} /> },
        {
          path: "/logins/:loginId",
          element: <LoginViewPage isLoggedIn={isLoggedIn} />,
        },
        {
          path: "/new-login-page",
          element: <NewLoginPage isLoggedIn={isLoggedIn} />,
        },
        {
          path: "/shared-logins",
          element: <SharedLoginsPage isLoggedIn={isLoggedIn} />,
        },
        { path: "/trash", element: <TrashPage isLoggedIn={isLoggedIn} /> },
      ],
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
