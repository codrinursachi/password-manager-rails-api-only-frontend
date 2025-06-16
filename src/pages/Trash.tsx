import LoginDialog from "@/components/logins/login-dialog";
import TrashedLoginsTable from "@/components/trashed-logins/trashed-logins-table";
import { queryClient } from "@/util/query-utils/query-client";
import { queryTrashedLogins } from "@/util/query-utils/query-trashed-logins";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLoaderData } from "react-router";
import { toast } from "sonner";

const TrashPage = () => {
    const { data, error } = useQuery({
        queryKey: ["trashedLogins"],
        queryFn: ({ signal }) => queryTrashedLogins(signal),
        initialData: useLoaderData(),
    });
    useEffect(() => {
        if (error) {
            toast.error(error.message, {
                description: "Failed to load trashed logins.",
                action: {
                    label: "Retry",
                    onClick: () =>
                        queryClient.invalidateQueries({
                            queryKey: ["trashedLogins"],
                        }),
                },
            });
        }
    }, [error]);
    return (
        <div className="flex flex-col gap-4">
            <h1>Trash Page</h1>
            <LoginDialog />
            <TrashedLoginsTable trashedLogins={data?.trashedLogins} />
        </div>
    );
};

export default TrashPage;
