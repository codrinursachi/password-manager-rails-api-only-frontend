import { networkFetch } from "../network-utils/network-fetch";

export async function queryTrashedLogins(signal: AbortSignal) {
  const response = await networkFetch("trashes", signal);
  return {
    trashedLogins: response,
  };
}
