import LoginsTable from "@/components/logins-table";
import LoginDialog from "@/components/login-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthToken } from "@/util/auth";
import { redirect, useLoaderData, useNavigate } from "react-router";

const LoginsPage = () => {
  const logins = useLoaderData().logins;
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search")?.toString() || "";
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    navigate(`${url.pathname}?${url.searchParams.toString()}`);
  };
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
      <LoginsTable logins={logins} />
    </div>
  );
};

export default LoginsPage;

export async function loader({ request }) {
  const url = new URL(request.url);
  const queryParameter = url.searchParams.toString();
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/logins?${queryParameter}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: getAuthToken() || "",
      },
    }
  );
  if (!response.ok) {
    console.log(response);
  }
  const data = await response.json();
  return {
    logins: data,
  };
}

export async function individualLoginLoader({ params }) {
  const loginId = params.loginId;
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/logins/" + loginId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: getAuthToken() || "",
      },
    }
  );
  if (!response.ok) {
    return {
      error: "Failed to fetch login",
    };
  }
  const data = await response.json();
  return {
    individualLogin: data,
  };
}

export async function action({ request, params }) {
  const loginId = params.loginId;
  const method = request.method.toUpperCase();
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/logins/" + (loginId ? loginId : ""),
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

  return redirect("/logins");
}
