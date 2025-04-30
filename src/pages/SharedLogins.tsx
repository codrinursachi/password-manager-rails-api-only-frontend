import LoginDialog from "@/components/login-dialog";
import SharedLoginsTable from "@/components/shared-logins-table";
import { getAuthToken } from "@/util/auth";
import { querySharedLogins } from "@/util/query-shared-logins";
import { useQuery } from "@tanstack/react-query";
import { redirect, useLoaderData } from "react-router";

const SharedLoginsPage = () => {
  const url = new URL(window.location.href);
  const queryParameter = url.pathname.includes("by-me") ? "by_me=true" : "";
  const { data } = useQuery({
    queryKey: ["sharedLogins", queryParameter],
    queryFn: () => querySharedLogins(queryParameter),
    initialData: useLoaderData(),
  });
  return (
    <div>
      <h1>Shared Logins</h1>
      <LoginDialog />
      <SharedLoginsTable sharedLogins={data.sharedLogins} />
    </div>
  );
};
export default SharedLoginsPage;

export async function loader({ request }) {
  const url = new URL(request.url);
  const queryParameter = url.pathname.includes("by-me") ? "by_me=true" : "";
  return querySharedLogins(queryParameter);
}

export async function action({ request }) {
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/shared_login_data",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: getAuthToken() || "",
      },
      body: await request.formData(),
    }
  );
  if (!response.ok) {
    console.log(await response.json());
  }

  return redirect("/shared-logins/by-me");
}

export async function deleteAction({ params }) {
  const loginId = params.loginId;
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/shared_login_data/" + loginId,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: getAuthToken() || "",
      },
    }
  );

  if (!response.ok) {
    console.log(await response.json());
  }

  return redirect("/shared-logins/by-me");
}
