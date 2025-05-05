import { getAuthToken } from "./auth";

export async function queryLogin(loginId: string) {
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
