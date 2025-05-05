import { getAuthToken } from "@/util/auth";
import { redirect } from "react-router";

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { folderId?: number };
}) {
  const method = request.method.toUpperCase();
  const folderId = params.folderId;
  const response = await fetch(
    "http://127.0.0.1:3000/api/v1/folders/" + (folderId ? folderId : ""),
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
