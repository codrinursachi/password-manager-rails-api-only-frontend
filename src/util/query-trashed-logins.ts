import { getAuthToken } from "./auth";

export async function queryTrashedLogins() {
  const response = await fetch("http://127.0.0.1:3000/api/v1/trashes", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: getAuthToken() || "",
    },
  });
  if (!response.ok) {
    console.log(response);
  }
  const data = await response.json();
  return {
    trashedLogins: data,
  };
}
