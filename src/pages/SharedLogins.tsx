import LoginDialog from "@/components/login-dialog";
import SharedLoginsTable from "@/components/shared-logins-table";
import { getAuthToken } from "@/util/auth";
import {
  decryptAES,
  encryptRSAPassword as encryptRSAPassword,
} from "@/util/crypt-utils/cryptography";
import { queryClient } from "@/util/query-utils/query-client";
import { queryLogin } from "@/util/query-utils/query-login";
import { querySharedLogins } from "@/util/query-utils/query-shared-logins";
import { useQuery } from "@tanstack/react-query";
import { redirect, useLoaderData } from "react-router";

const SharedLoginsPage = () => {
  const url = new URL(window.location.href);
  const queryParameter = url.pathname.includes("by-me") ? "by_me=true" : "";
  const { data } = useQuery({
    queryKey: ["sharedLogins", queryParameter],
    queryFn: ({ signal }) => querySharedLogins(queryParameter, signal),
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

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const queryParameter = url.pathname.includes("by-me") ? "by_me=true" : "";
  return queryClient.fetchQuery({
    queryKey: ["sharedLogins", queryParameter],
    queryFn: ({ signal }) => querySharedLogins(queryParameter, signal),
  });
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const publicKeyResponse = await fetch(
    "http://127.0.0.1:3000/api/v1/shared_login_data/new?email=" +
      formData.get("shared_login_datum[email]"),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: getAuthToken() || "",
      },
    }
  );
  if (!publicKeyResponse.ok) {
    console.log(await publicKeyResponse.json());
    return redirect("/logins");
  }
  const publicKey = (await publicKeyResponse.json()).public_key;
  const { individualLogin } = await queryClient.fetchQuery({
    queryKey: ["individualLogin", formData.get("shared_login_datum[login_id]")],
    queryFn: ({ signal }) =>
      queryLogin(formData.get("shared_login_datum[login_id]")?.toString()!, signal),
  });
  const plaintextPassword = await decryptAES(
    individualLogin.login_password,
    individualLogin.iv
  );
  const password = await encryptRSAPassword(plaintextPassword, publicKey);
  formData.set("shared_login_datum[password]", password);
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/shared_login_data",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: getAuthToken() || "",
      },
      body: formData,
    }
  );
  if (!response.ok) {
    console.log(await response.json());
    return redirect("/logins");
  }

  return redirect("/shared-logins/by-me");
}

export async function deleteAction({
  params,
}: {
  params: { loginId?: string };
}) {
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
