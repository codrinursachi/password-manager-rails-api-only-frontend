import { encryptAES } from "../crypt-utils/cryptography";
import { networkFetch } from "../network-utils/network-fetch";

export async function mutateNote({text, id}:{
  text: string;
  id?: number;
}) {
  if (!text) {
    await networkFetch(`notes/${id}`, undefined, "DELETE");
    return;
  }
  const { iv, encryptedData } = await encryptAES(text);
  const formData = new FormData();
  formData.append("note[text]", encryptedData);
  formData.append("note[iv]", iv);
  if (id) {
    await networkFetch(`notes/${id}`, undefined, "PUT", formData);
  } else {
    await networkFetch("notes", undefined, "POST", formData);
  }
}
