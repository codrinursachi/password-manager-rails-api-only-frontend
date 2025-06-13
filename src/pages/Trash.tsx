import LoginDialog from "@/components/logins/login-dialog";
import TrashedLoginsTable from "@/components/trashed-logins/trashed-logins-table";
import { queryTrashedLogins } from "@/util/query-utils/query-trashed-logins";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router";

const TrashPage = () => {
    const { data } = useQuery({
        queryKey: ["trashedLogins"],
        queryFn: ({ signal }) => queryTrashedLogins(signal),
        initialData: useLoaderData(),
    });
    return (
        <div className="flex flex-col gap-4">
            <h1>Trash Page</h1>
            <LoginDialog />
            <TrashedLoginsTable trashedLogins={data?.trashedLogins} />
        </div>
    );
};

export default TrashPage;