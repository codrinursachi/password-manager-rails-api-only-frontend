import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import LoginPage from "./pages/Login";
import LoginsPage, { loader as loginsLoader } from "./pages/Logins";
import { checkAuthLoader } from "./util/auth.ts";
import RootLayout, {loader as foldersLoader} from "./pages/RootLayout";
import RegisterPage from "./pages/Register";
import TrashPage from "./pages/Trash";
import SharedLoginsPage from "./pages/SharedLogins";
import LoginViewPage from "./pages/LoginView";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { action as logoutAction } from "./pages/Logout";

const rootLoader = async () => {
  const authLoaderResult = checkAuthLoader();
  if (authLoaderResult instanceof Response) {
    return authLoaderResult;
  }
  const folders = await foldersLoader();
  return folders;
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      id: "data",
      loader: rootLoader,
      children: [
        { index: true, element: <LoginsPage />, loader: loginsLoader },
        {
          path: "logins/:loginId",
          element: <LoginViewPage />,
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
