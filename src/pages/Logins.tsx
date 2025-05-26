import LoginsTable from "@/components/logins-table";
import LoginDialog from "@/components/login-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect, useLoaderData, useNavigate } from "react-router";
import { queryLogins } from "@/util/query-utils/query-logins";
import { queryLogin } from "@/util/query-utils/query-login";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { encryptAES } from "@/util/crypt-utils/cryptography";
import { queryClient } from "@/util/query-utils/query-client";
import { networkFetch } from "@/util/network-utils/network-fetch";

const LoginsPage = () => {
  const navigate = useNavigate();
  const url = new URL(window.location.href);
  const queryParameter = url.searchParams.toString();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search")?.toString() || "";
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    navigate(`${url.pathname}?${url.searchParams.toString()}`);
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["logins", queryParameter],
    queryFn: ({ signal }) => queryLogins(queryParameter, signal),
    staleTime: 3000,
    initialData: useLoaderData(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Logins</h1>
      <form
        className="flex w-full max-w-sm items-center space-x-2"
        onSubmit={handleSearch}
      >
        <Input type="text" name="search" />
        <Button type="submit">Search</Button>
      </form>
      <Button
        variant="outline"
        onClick={() => navigate("/logins/new")}
        className="w-46"
      >
        Create login
      </Button>
      <LoginDialog />
      {data && <LoginsTable logins={data.logins} />}
    </div>
  );
};

export default LoginsPage;

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const queryParameter = url.searchParams.toString();
  const queryClient = new QueryClient();
  return queryClient.fetchQuery({
    queryKey: ["logins", queryParameter],
    queryFn: ({ signal }) => queryLogins(queryParameter, signal),
    staleTime: 3000,
  });
}

export async function individualLoginLoader({
  params,
}: {
  params: { loginId?: string };
}) {
  const loginId = params.loginId;
  return queryClient.fetchQuery({
    queryKey: ["individualLogin", loginId],
    queryFn: ({ signal }) => queryLogin(loginId!, signal),
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
  const formData = await request.formData();
  const passwordData = await encryptAES(
    formData.get("login[login_password]")?.toString()!
  );
  formData.set("login[login_password]", passwordData.encryptedData);
  formData.set("login[iv]", passwordData.iv);
  await networkFetch(
    "logins/" + (loginId ? loginId : ""),
    undefined,
    method,
    formData
  );
  queryClient.invalidateQueries({ queryKey: ["logins"] });
  return redirect("/logins");
}
