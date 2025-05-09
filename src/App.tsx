import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import LoginPage from "./pages/Login";
import LoginsPage, {
  loader as loginsLoader,
  action as LoginAction,
} from "./pages/Logins";
import { action as folderAction } from "./pages/Folders";
import RootLayout from "./pages/RootLayout";
import RegisterPage from "./pages/Register";
import TrashPage, {
  loader as trashedLoginsLoader,
  action as trashLoginAction,
} from "./pages/Trash";
import SharedLoginsPage, {
  action as shareLoginAction,
  deleteAction as sharedLoginDeleteAction,
  loader as sharedLoginsLoader,
} from "./pages/SharedLogins";
import { QueryClientProvider } from "@tanstack/react-query";
import { action as logoutAction } from "./pages/Logout";
import { queryClient } from "./util/query-utils/query-client.ts";
import { combinedLoginsLoader, combinedSharedLoginsLoader, combinedTrashLoginsLoader, rootLoader } from "./util/combined-loaders.ts";

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
        path: "shared-logins/",
        element: <Navigate to="/shared-logins/by-me" />,
        action: shareLoginAction,
      },
      {
        path: "shared-logins/by-me",
        element: <SharedLoginsPage />,
        loader: sharedLoginsLoader,
      },
      {
        path: "shared-logins/with-me",
        element: <SharedLoginsPage />,
        loader: sharedLoginsLoader,
      },
      {
        path: "shared-logins/by-me/:loginId",
        element: <SharedLoginsPage />,
        loader: combinedSharedLoginsLoader,
        action: sharedLoginDeleteAction,
      },
      {
        path: "shared-logins/with-me/:loginId",
        element: <SharedLoginsPage />,
        loader: combinedSharedLoginsLoader,
        action: sharedLoginDeleteAction,
      },
      { path: "trash", element: <TrashPage />, loader: trashedLoginsLoader },
      {
        path: "trash/:loginId",
        element: <TrashPage />,
        loader: combinedTrashLoginsLoader,
        action: trashLoginAction,
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/logout", action: logoutAction },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

export default App;
