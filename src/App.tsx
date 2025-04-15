import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./App.css";
import LoginPage from "./pages/Login";
import LoginsPage, {
  individualLoginLoader,
  loader as loginsLoader,
  action as LoginAction,
} from "./pages/Logins";
import { action as folderAction } from "./pages/Folders";
import { checkAuthLoader } from "./util/auth.ts";
import RootLayout, { loader as foldersLoader } from "./pages/RootLayout";
import RegisterPage from "./pages/Register";
import TrashPage from "./pages/Trash";
import SharedLoginsPage, { action as ShareLoginAction, loader as SharedLoginsLoader } from "./pages/SharedLogins";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { action as logoutAction } from "./pages/Logout";

const rootLoader = async () => {
  const authLoaderResult = checkAuthLoader();
  if (authLoaderResult instanceof Response) {
    return authLoaderResult;
  }
  const folders = await foldersLoader();
  return folders;
};

const combinedLoginsLoader = async ({ params, request }) => {
  const [allLogins, individualLogin] = await Promise.all([
    loginsLoader({ request }),
    individualLoginLoader({ params }),
  ]);

  return { ...allLogins, ...individualLogin };
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "data",
    loader: rootLoader,
    children: [
      { index: true, element: <Navigate to="/logins" /> },
      {
        path: "logins",
        element: <LoginsPage />,
        loader: loginsLoader,
        action: LoginAction,
      },
      {
        path: "logins/new",
        element: <LoginsPage />,
        loader: loginsLoader,
      },
      {
        path: "logins/:loginId",
        action: LoginAction,
      },
      {
        path: "logins/:loginId/edit",
        element: <LoginsPage />,
        loader: combinedLoginsLoader,
      },
      {
        path: "folders",
        action: folderAction,
      },
      {
        path: "folders/:folderId",
        action: folderAction,
      },
      {
        path: "shared-logins",
        element: <SharedLoginsPage />,
        loader: SharedLoginsLoader,
        action: ShareLoginAction,
      },
      {
        path: "shared-logins/:loginId",
        element: <SharedLoginsPage />,
      },
      { path: "trash", element: <TrashPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/logout", action: logoutAction },
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

export default App;
