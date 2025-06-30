import { Link, useNavigate, useSearchParams } from "react-router";
import LoginDropdown from "./login-dropdown";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import { useEffect } from "react";
import { TableContentSkeleton } from "../skeletons/table-content-skeleton";
import { useMutation, useMutationState, useQuery } from "@tanstack/react-query";
import { queryLogins } from "@/util/query-utils/query-logins";
import { toast } from "sonner";
import { queryClient } from "@/util/query-utils/query-client";
import { mutateLogin } from "@/util/mutate-utils/mutate-login";
import { mutateSharedLogin } from "@/util/mutate-utils/mutate-shared-login";

type Login = {
    login_id: number;
    name: string;
    login_name: string;
    urls: string[];
    login_password: string;
    iv: string;
};

const transformToLogin = (individualFormData: FormData): Login => ({
    login_id: parseInt(
        individualFormData.get("login[login_id]")?.toString() ?? "0"
    ),
    name: individualFormData.get("login[name]")!.toString(),
    login_name: individualFormData.get("login[login_name]")!.toString(),
    urls: [
        individualFormData.get("login[urls_attributes][0][uri]")!.toString(),
    ],
    login_password: "",
    iv: "",
});
function LoginsTable() {
    const [searchParams] = useSearchParams();
    const { data, error } = useQuery<{ logins: Login[] }>({
        queryKey: ["logins", searchParams.toString()],
        queryFn: ({ signal }) => queryLogins(searchParams.toString(), signal),
    });

    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                description: "Failed to load logins.",
                action: {
                    label: "Retry",
                    onClick: () =>
                        queryClient.invalidateQueries({
                            queryKey: ["logins", searchParams.toString()],
                        }),
                },
            });
        }
    }, [error]);

    const pendingLoginsAdd = useMutationState({
        filters: { mutationKey: ["login", "add"], status: "pending" },
        select: (mutation) =>
            transformToLogin(mutation.state.variables as FormData),
    });
    const pendingLoginsEdit = useMutationState({
        filters: { mutationKey: ["login", "edit"], status: "pending" },
        select: (mutation) =>
            transformToLogin(mutation.state.variables as FormData),
    });
    const pendingLoginsTrash = useMutationState({
        filters: { mutationKey: ["login", "trash"], status: "pending" },
        select: (mutation) => parseInt(mutation.state.variables as string),
    });

    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: async (loginId: string) => {
            await mutateLogin(null, loginId, "DELETE");
        },
        mutationKey: ["login", "trash"],
        onError: (error: Error, variables) => {
            console.error(error);
            toast.error(error.message, {
                description: "Error sending login to trash",
                action: {
                    label: "Try again",
                    onClick: () => loginMutation.mutate(variables),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["logins", ""] });
        },
    });
    const sharedLoginMutation = useMutation({
        mutationFn: async ({ formData, loginId }: { formData: FormData; loginId: string }) => {
            navigate("/shared-logins/by-me");
            await mutateSharedLogin(formData, loginId);
        },
        mutationKey: ["sharedLogins", "add"],
        onError: (error: Error, variables) => {
            toast.error(error.message, {
                description: "Error sharing login",
                action: {
                    label: "Try again",
                    onClick: () => sharedLoginMutation.mutate(variables),
                },
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["shared-logins", "by_me=true"],
            });
        },
    });
    return (
        <Table className="table-fixed">
            <TableHeader>
                <TableRow>
                    <TableHead key="name">Name</TableHead>
                    <TableHead key="username">Username</TableHead>
                    <TableHead key="url">URL</TableHead>
                    <TableHead key="actions" className="w-16">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {!data?.logins && <TableContentSkeleton cellNumber={4} />}
                {data?.logins?.map((login) => {
                    const pendingEdit = pendingLoginsEdit.find(
                        (pendingLogin) =>
                            pendingLogin.login_id === login.login_id
                    );
                    login = pendingEdit ? pendingEdit : login;
                    const pendingTrash = pendingLoginsTrash.find(
                        (pendingLogin) => pendingLogin === login.login_id
                    );
                    return (
                        <TableRow
                            key={login.login_id.toString()}
                            className={
                                pendingEdit
                                    ? "text-green-500"
                                    : pendingTrash
                                    ? "text-red-500"
                                    : ""
                            }
                        >
                            <TableCell>
                                <Link
                                    to={"/logins/" + login.login_id + "/edit"}
                                >
                                    <div className="w-full">{login.name}</div>
                                </Link>
                            </TableCell>
                            <TableCell>{login.login_name}</TableCell>
                            <TableCell>
                                <Link
                                    to={
                                        (login.urls[0].includes("http") &&
                                            login.urls[0]) ||
                                        "//" + login.urls[0]
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="w-full">
                                        {login.urls[0]}
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                {!pendingEdit && !pendingTrash && (
                                    <LoginDropdown
                                        login={login}
                                        loginMutation={loginMutation}
                                        sharedLoginMutation={
                                            sharedLoginMutation
                                        }
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
                {pendingLoginsAdd.map((login, index) => (
                    <TableRow
                        key={"pending-add-" + index}
                        className="text-gray-500"
                    >
                        <TableCell>{login.name}</TableCell>
                        <TableCell>{login.login_name}</TableCell>
                        <TableCell>{login.urls[0]}</TableCell>
                        <TableCell />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default LoginsTable;
