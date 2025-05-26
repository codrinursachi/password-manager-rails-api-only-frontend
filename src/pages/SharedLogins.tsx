import LoginDialog from "@/components/login-dialog";
import SharedLoginsTable from "@/components/shared-logins-table";
import {
  decryptAES,
  encryptRSAPassword as encryptRSAPassword,
} from "@/util/crypt-utils/cryptography";
import { networkFetch } from "@/util/network-utils/network-fetch";
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
    <div className="flex flex-col gap-4">
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
  const publicKey = (
    await networkFetch(
      "shared_login_data/new?email=" + formData.get("shared_login_datum[email]")
    )
  ).public_key;
  if (!publicKey) {
    return redirect("/logins");
  }
  const { individualLogin } = await queryClient.fetchQuery({
    queryKey: ["individualLogin", formData.get("shared_login_datum[login_id]")],
    queryFn: ({ signal }) =>
      queryLogin(
        formData.get("shared_login_datum[login_id]")?.toString()!,
        signal
      ),
  });
  const plaintextPassword = await decryptAES(
    individualLogin.login_password,
    individualLogin.iv
  );
  const password = await encryptRSAPassword(plaintextPassword, publicKey);
  formData.set("shared_login_datum[password]", password);
  const response = await networkFetch(
    "shared_login_data",
    undefined,
    "POST",
    formData
  );
  if (response.error) {
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
  await networkFetch("shared_login_data/" + loginId, undefined, "DELETE");
  return redirect("/shared-logins/by-me");
}
