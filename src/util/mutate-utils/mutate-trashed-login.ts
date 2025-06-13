import { networkFetch } from "../network-utils/network-fetch";
import { queryClient } from "../query-utils/query-client";

export async function mutateTrashedLogin(
    loginId: string,
    method: "PATCH" | "DELETE"
) {
    await networkFetch("trashes/" + loginId, undefined, method, null);
    queryClient.invalidateQueries({ queryKey: ["trashedLogins"] });
}
