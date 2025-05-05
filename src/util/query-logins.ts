import { getAuthToken } from "./auth";

export async function queryLogins(queryParameters: string) {
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/logins?${queryParameters}`,
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
