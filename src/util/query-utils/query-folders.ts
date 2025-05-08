import { networkFetch } from "../network-utils/network-fetch";

export async function queryFolders(signal: AbortSignal) {
  const response = await networkFetch("folders", signal);

  return response;
}
