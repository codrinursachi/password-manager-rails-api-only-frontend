import { networkFetch } from "../network-utils/network-fetch";

export async function queryNotes(signal: AbortSignal) {
  const response = await networkFetch("notes", signal);
  return {
    notes: response
  };
}
