import { getAuthToken } from "../auth";

export async function networkFetch(
    address: string,
    signal?: AbortSignal | null,
    method: string = "GET",
    body?: FormData | null
) {
    const response = await fetch("/api/v1/" + address, {
        signal,
        method,
        headers: {
            Accept: "application/json",
            Authorization: getAuthToken() || "",
        },
        body,
    });

    if (!response.ok) {
        console.log(response);
    }

    return method !== "DELETE" && response.json();
}
