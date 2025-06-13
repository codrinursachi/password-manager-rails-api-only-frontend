import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import LoginPage from "./pages/Login";
import RootLayout from "./pages/RootLayout";
import RegisterPage from "./pages/Register";
import TrashPage from "./pages/Trash";
import SharedLoginsPage from "./pages/SharedLogins";
import { QueryClientProvider } from "@tanstack/react-query";
import { action as logoutAction } from "./pages/Logout";
import { queryClient } from "./util/query-utils/query-client.ts";
import NotesPage from "./pages/Notes.tsx";
import SSHKeysPage from "./pages/SSHKeys.tsx";
import { checkAuthLoader } from "./util/auth.ts";
import LoginsPage from "./pages/Logins.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        id: "data",
        loader: checkAuthLoader,
        children: [
            { index: true, element: <Navigate to="/logins" /> },
            {
                path: "logins",
                element: <LoginsPage />,
            },
            {
                path: "logins/new",
                element: <LoginsPage />,
            },
            {
                path: "logins/:loginId/edit",
                element: <LoginsPage />,
            },
            {
                path: "shared-logins/by-me",
                element: <SharedLoginsPage />,
            },
            {
                path: "shared-logins/with-me",
                element: <SharedLoginsPage />,
            },
            {
                path: "shared-logins/by-me/:loginId",
                element: <SharedLoginsPage />,
            },
            {
                path: "shared-logins/with-me/:loginId",
                element: <SharedLoginsPage />,
            },
            {
                path: "trash",
                element: <TrashPage />,
            },
            {
                path: "trash/:loginId",
                element: <TrashPage />,
            },
            {
                path: "notes",
                element: <NotesPage />,
            },
            {
                path: "notes/new",
                element: <NotesPage />,
            },
            {
                path: "notes/:noteId/edit",
                element: <NotesPage />,
            },
            {
                path: "ssh-keys",
                element: <SSHKeysPage />,
            },
            {
                path: "ssh-keys/new",
                element: <SSHKeysPage />,
            },
            {
                path: "ssh-keys/:keyId/edit",
                element: <SSHKeysPage />,
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
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

export default App;
