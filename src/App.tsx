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
import TrashPage, {
  loader as trashedLoginsLoader,
  action as trashLoginAction,
} from "./pages/Trash";
import SharedLoginsPage, {
  action as shareLoginAction,
  deleteAction as sharedLoginDeleteAction,
  loader as sharedLoginsLoader,
} from "./pages/SharedLogins";
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

const combinedSharedLoginsLoader = async ({ params, request }) => {
  const [sharedLogins, individualLogin] = await Promise.all([
    sharedLoginsLoader({ request }),
    individualLoginLoader({ params }),
  ]);

  return { ...sharedLogins, ...individualLogin };
}

const combinedTrashLoginsLoader = async ({ params }) => {
  const [trashedLogins, individualLogin] = await Promise.all([
    trashedLoginsLoader(),
    individualLoginLoader({ params }),
  ]);

  return { ...trashedLogins, ...individualLogin };
}

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
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

export default App;
