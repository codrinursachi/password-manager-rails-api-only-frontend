import LoginDialog from "@/components/login-dialog";
import TrashedLoginsTable from "@/components/trashed-logins-table";
import { getAuthToken } from "@/util/auth";
import { queryTrashedLogins } from "@/util/query-trashed-logins";
import { useQuery } from "@tanstack/react-query";
import { redirect, useLoaderData } from "react-router";

const TrashPage = () => {
  const { data } = useQuery({
    queryKey: ["trashedLogins"],
    queryFn: () => queryTrashedLogins(),
    initialData: useLoaderData(),
  });
  return (
    <div>
      <h1>Trash Page</h1>
      <LoginDialog />
      <TrashedLoginsTable trashedLogins={data.trashedLogins} />
    </div>
  );
};

export default TrashPage;

export async function loader() {
  return queryTrashedLogins();
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
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/trashes/" + loginId,
    {
      method,
      headers: {
        Accept: "application/json",
        Authorization: getAuthToken() || "",
      },
      body: await request.formData(),
    }
  );
  if (!response.ok) {
    console.log(response);
  }

  return redirect("/trash");
}
