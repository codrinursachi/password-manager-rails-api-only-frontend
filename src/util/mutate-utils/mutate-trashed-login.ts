import { networkFetch } from "../network-utils/network-fetch";

export async function mutateTrashedLogin(
    loginId: string,
    method: "PATCH" | "DELETE"
) {
    await networkFetch("trashes/" + loginId, undefined, method, null);
}
