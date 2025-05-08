import { networkFetch } from "../network-utils/network-fetch";

export async function querySharedLogins(
  queryParameter: string,
  signal: AbortSignal
) {
  const response = await networkFetch(
    "shared_login_data?" + queryParameter,
    signal
  );

  return {
    sharedLogins: response,
  };
}
