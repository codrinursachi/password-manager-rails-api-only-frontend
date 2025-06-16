import { encryptAES } from "../crypt-utils/cryptography";
import { networkFetch } from "../network-utils/network-fetch";

export async function mutateSSHKey(
    formData: FormData | null,
    keyId: string | undefined,
    method: "POST" | "PATCH" | "DELETE"
) {
    if (method !== "DELETE") {
        const privateKeyData = await encryptAES(
            formData!.get("sshkey[private_key]")?.toString()!
        );
        formData!.set("sshkey[private_key]", privateKeyData.encryptedData);
        formData!.set("sshkey[iv]", privateKeyData.iv);
    }
    await networkFetch(
        "sshkeys/" + (keyId ? keyId : ""),
        null,
        method,
        formData
    );
}
