import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import LoginPage from "./pages/Login";
import LoginsPage from "./pages/Logins";
import { checkAuthLoader } from "./util/auth.ts";
import RootLayout from "./pages/RootLayout";
import RegisterPage from "./pages/Register";
import TrashPage from "./pages/Trash";
import SharedLoginsPage from "./pages/SharedLogins";
import LoginViewPage from "./pages/LoginView";
import NewLoginPage from "./pages/NewLogin";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { action as logoutAction } from "./pages/Logout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      loader: checkAuthLoader,
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
    { path: "/logout", action: logoutAction },
  ]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

export default App;
