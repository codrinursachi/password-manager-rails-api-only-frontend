import { getAuthToken } from "../auth";

export async function networkFetch(address: string, signal: AbortSignal) {
  const response = await fetch("http://127.0.0.1:3000/api/v1/"+address, {
    signal: signal,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: getAuthToken() || "",
    },
  });

  if (!response.ok) {
    console.log(response);
  }

  return response.json();
}