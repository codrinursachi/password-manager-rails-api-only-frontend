import LoginDialog from "@/components/logins/login-dialog";
import SharedLoginsTable from "@/components/shared-logins/shared-logins-table";
import { querySharedLogins } from "@/util/query-utils/query-shared-logins";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";

const SharedLoginsPage = () => {
    const url = new URL(window.location.href);
    const queryParameter = url.pathname.includes("by-me") ? "by_me=true" : "";
    const { data } = useQuery({
        queryKey: ["sharedLogins", queryParameter],
        queryFn: ({ signal }) => querySharedLogins(queryParameter, signal),
        initialData: useLoaderData(),
    });
    return (
        <div className="flex flex-col gap-4">
            <h1>Shared Logins</h1>
            <LoginDialog />
            <SharedLoginsTable sharedLogins={data?.sharedLogins} />
        </div>
    );
};

export default SharedLoginsPage;