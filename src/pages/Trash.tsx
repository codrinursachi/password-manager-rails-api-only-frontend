import LoginDialog from "@/components/logins/login-dialog";
import TrashedLoginsTable from "@/components/trashed-logins/trashed-logins-table";
import { networkFetch } from "@/util/network-utils/network-fetch";
import { queryClient } from "@/util/query-utils/query-client";
import { queryTrashedLogins } from "@/util/query-utils/query-trashed-logins";
import { useQuery } from "@tanstack/react-query";
import { redirect, useLoaderData } from "react-router";

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
            <TrashedLoginsTable trashedLogins={data.trashedLogins} />
        </div>
    );
};

export default TrashPage;

export async function loader() {
    return queryClient.fetchQuery({
        queryKey: ["trashedLogins"],
        queryFn: ({ signal }) => queryTrashedLogins(signal),
    });
}

export async function action({
    request,
    params,
}: {
    request: Request;
    params: { loginId?: string };
}) {
    const loginId = params.loginId;
    const method = request.method.toUpperCase();
    await networkFetch(
        "trashes/" + loginId,
        undefined,
        method,
        await request.formData()
    );
    return redirect("/trash");
}
