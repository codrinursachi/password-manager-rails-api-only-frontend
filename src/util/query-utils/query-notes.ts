import { decryptAES } from "../crypt-utils/cryptography";
import { networkFetch } from "../network-utils/network-fetch";

export async function queryNotes(signal: AbortSignal) {
  const response = await networkFetch("notes", signal);
  const notes = response;
  return {
    notes: await Promise.all(notes.map(async (note) => ({
      id: note.id,
      text: await decryptAES(note.text, note.iv),
    })))
  };
}
