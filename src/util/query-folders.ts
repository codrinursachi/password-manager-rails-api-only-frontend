import { getAuthToken } from "./auth";

export async function queryFolders() {
  const response = await fetch("http://127.0.0.1:3000/api/v1/folders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: getAuthToken() || "",
    },
  });

  return response.json();
}
