import LoginsTable from "@/components/logins-table";
import LoginDialog from "@/components/login-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthToken } from "@/util/auth";
import { redirect, useLoaderData, useNavigate } from "react-router";
import { queryLogins } from "@/util/query-utils/query-logins";
import { queryLogin } from "@/util/query-utils/query-login";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { encryptAES } from "@/util/crypt-utils/cryptography";
import { queryClient } from "@/util/query-utils/query-client";

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
    initialData: useLoaderData(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Logins</h1>
      <form
        className="flex w-full max-w-sm items-center space-x-2"
        onSubmit={handleSearch}
      >
        <Input type="text" name="search" />
        <Button type="submit">Search</Button>
      </form>
      <Button variant="outline" onClick={() => navigate("/logins/new")}>
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
  const passwordData = encryptAES(
    formData.get("login[login_password]")?.toString()!
  );
  formData.set("login[login_password]", (await passwordData).encryptedData);
  formData.set("login[iv]", (await passwordData).iv);
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/logins/" + (loginId ? loginId : ""),
    {
      method,
      headers: {
        Accept: "application/json",
        Authorization: getAuthToken() || "",
      },
      body: formData,
    }
  );
  if (!response.ok) {
    console.log(response);
  }

  queryClient.invalidateQueries({ queryKey: ["logins"] });
  return redirect("/logins");
}
