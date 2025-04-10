import LoginsTable from "@/components/logins-table";
import NewLoginDialog from "@/components/new-login-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthToken } from "@/util/auth";
import { useLoaderData } from "react-router";

const LoginsPage = () => {
  const logins = useLoaderData().logins;
  return (
    <div>
      <h1>Logins</h1>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text"/>
        <Button type="submit">Search</Button>
      </div>
      <NewLoginDialog />
      <LoginsTable logins={logins} />
    </div>
  );
};

export default LoginsPage;

export async function loader() {
  const response = await fetch("http://127.0.0.1:3000/api/v1/logins", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: getAuthToken() || "",
    },
  });
  if (!response.ok) {
    return {
      error: "Failed to fetch logins",
    };
  }
  const data = await response.json();
  console.log(data);
  return {
    logins: data,
  };
}
