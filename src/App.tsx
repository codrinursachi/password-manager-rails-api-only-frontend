import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import LoginsPage from "./pages/LoginsPage";
import { useState } from "react";
import RootLayout from "./pages/RootLayout";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <LoginsPage isLoggedIn={isLoggedIn} /> },
        {path: "/logins", element: <LoginsPage isLoggedIn={isLoggedIn} />},
      ],
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
