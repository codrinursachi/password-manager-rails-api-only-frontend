import { encryptAES } from "../crypt-utils/cryptography";
import { networkFetch } from "../network-utils/network-fetch";

export async function mutateNote(
    formData: FormData | null,
    noteId: string | undefined,
    method: "POST" | "PATCH" | "DELETE"
) {
    if (method !== "DELETE") {
        const [encryptedNoteName, encryptedNoteText] = await Promise.all([
            encryptAES(formData!.get("note[name]")?.toString()!),
            encryptAES(formData!.get("note[text]")?.toString()!),
        ]);
        formData!.set("note[name]", encryptedNoteName.encryptedData);
        formData!.set("note[name_iv]", encryptedNoteName.iv);
        formData!.set("note[text]", encryptedNoteText.encryptedData);
        formData!.set("note[iv]", encryptedNoteText.iv);
    }
    await networkFetch(
        "notes/" + (noteId ?? ""),
        undefined,
        method,
        formData
    );
}