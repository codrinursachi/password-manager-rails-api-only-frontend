import LoginDialog from "@/components/login-dialog";
import TrashedLoginsTable from "@/components/trashed-logins-table";
import { getAuthToken } from "@/util/auth";
import { redirect, useLoaderData } from "react-router";

const TrashPage = () => {
  const {trashedLogins} = useLoaderData();
  return (
    <div>
      <h1>Trash Page</h1>
      <LoginDialog />
      <TrashedLoginsTable trashedLogins={trashedLogins} />
    </div>
  );
}

export default TrashPage;

export async function loader() {
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/trashes",
    {
      method: "GET",
      headers: {
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
    trashedLogins: data,
  };
}

export async function action({ request, params }) {
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