import { networkFetch } from "../network-utils/network-fetch";

export async function queryLogin(loginId: string, signal: AbortSignal) {
  const response = await networkFetch("logins/" + loginId, signal);
  return {
    individualLogin: response,
  };
}
