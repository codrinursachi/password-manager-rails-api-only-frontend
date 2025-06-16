import LoginDialog from "@/components/logins/login-dialog";
import SharedLoginsTable from "@/components/shared-logins/shared-logins-table";
import { queryClient } from "@/util/query-utils/query-client";
import { querySharedLogins } from "@/util/query-utils/query-shared-logins";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { toast } from "sonner";

const SharedLoginsPage = () => {
    const url = new URL(window.location.href);
    const queryParameter = url.pathname.includes("by-me") ? "by_me=true" : "";
    const { data, error } = useQuery({
        queryKey: ["sharedLogins", queryParameter],
        queryFn: ({ signal }) => querySharedLogins(queryParameter, signal),
        initialData: useLoaderData(),
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
        <div className="flex flex-col gap-4">
            <h1>Shared Logins</h1>
            <LoginDialog />
            <SharedLoginsTable sharedLogins={data?.sharedLogins} />
        </div>
    );
};

export default SharedLoginsPage;
