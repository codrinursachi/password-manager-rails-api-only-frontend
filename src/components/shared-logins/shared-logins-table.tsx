import { Link } from "react-router";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../ui/table";
import SharedLoginDropdown from "./shared-login-dropdown";
import { useEffect } from "react";
import { TableContentSkeleton } from "../skeletons/table-content-skeleton";
import { useMutationState, useQuery } from "@tanstack/react-query";
import { querySharedLogins } from "@/util/query-utils/query-shared-logins";
import { toast } from "sonner";
import { queryClient } from "@/util/query-utils/query-client";

type SharedLogin = {
    login_id: number;
    name: string;
    login_name: string;
    urls: string[];
    shared_by: string;
    shared_with: string;
    login_password: string;
    iv: string;
    id: number;
};

function SharedLoginsTable() {
    const url = new URL(window.location.href);
    const queryParameter = url.pathname.includes("by-me") ? "by_me=true" : "";
    const { data, error } = useQuery({
        queryKey: ["sharedLogins", queryParameter],
        queryFn: ({ signal }) => querySharedLogins(queryParameter, signal),
    });
    const pendingSharedLoginsAdd = useMutationState({
        filters: { mutationKey: ["sharedLogins", "add"], status: "pending" },
        select: (mutation) => {
            const formdata = new FormData(
                (mutation.state.variables as React.FormEvent<HTMLFormElement>)
                    .target as HTMLFormElement
            );
            return {
                name: formdata.get("shared_login_datum[name]")!.toString(),
                login_name: formdata
                    .get("shared_login_datum[login_name]")!
                    .toString(),
                url: formdata
                    .get("shared_login_datum[urls_attributes][0][uri]")!
                    .toString(),
                shared_with: formdata
                    .get("shared_login_datum[email]")
                    ?.toString(),
            };
        },
    });
    const pendingSharedLoginsDelete = useMutationState({
        filters: { mutationKey: ["sharedLogins", "delete"], status: "pending" },
        select: (mutation) => mutation.state.variables,
    });
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                description: "Failed to load shared logins.",
                action: {
                    label: "Retry",
                    onClick: () =>
                        queryClient.invalidateQueries({
                            queryKey: ["sharedLogins"],
                        }),
                },
            });
        }
    }, [error]);
    return (
        <Table className="table-fixed">
            <TableHeader>
                <TableRow>
                    <TableHead key="name">Name</TableHead>
                    <TableHead key="username">Username</TableHead>
                    <TableHead key="url">URL</TableHead>
                    {queryParameter ? (
                        <TableHead key="shared_with">Shared with</TableHead>
                    ) : (
                        <TableHead key="shared_by">Shared by</TableHead>
                    )}
                    <TableHead key="actions" className="w-16">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {!data?.sharedLogins && <TableContentSkeleton cellNumber={5} />}
                {data?.sharedLogins?.map((login: SharedLogin) => {
                    const pendingDelete = pendingSharedLoginsDelete.find(
                        (loginId) => loginId === login.id.toString()
                    );
                    return (
                        <TableRow
                            key={login.login_id}
                            className={pendingDelete ? "text-red-500" : ""}
                        >
                            <TableCell>
                                <Link
                                    to={
                                        "/shared-logins/" +
                                        (queryParameter
                                            ? "by-me/"
                                            : "with-me/") +
                                        login.login_id
                                    }
                                >
                                    <div className="w-full">{login.name}</div>
                                </Link>
                            </TableCell>
                            <TableCell>{login.login_name}</TableCell>
                            <TableCell>
                                <Link
                                    to={"//" + login.urls[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="w-full">
                                        {login.urls[0]}
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                {queryParameter ? (
                                    <div className="w-full">
                                        {login.shared_with}
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        {login.shared_by}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <SharedLoginDropdown login={login} />
                            </TableCell>
                        </TableRow>
                    );
                })}
                {pendingSharedLoginsAdd.map((login, index) => (
                    <TableRow key={index} className="text-gray-500">
                        <TableCell>
                            <div className="w-full">{login.name}</div>
                        </TableCell>
                        <TableCell>{login.login_name}</TableCell>
                        <TableCell>
                            <div className="w-full">{login.url}</div>
                        </TableCell>
                        <TableCell>{login.shared_with}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default SharedLoginsTable;
