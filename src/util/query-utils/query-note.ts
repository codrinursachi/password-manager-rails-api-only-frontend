import { networkFetch } from "../network-utils/network-fetch";

export async function queryNote(noteId: string, signal: AbortSignal) {
  const response = await networkFetch("notes/" + noteId, signal);
  return {
    individualNote: response,
  };
}