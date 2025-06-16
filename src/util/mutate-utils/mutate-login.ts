import { encryptAES } from "../crypt-utils/cryptography";
import { networkFetch } from "../network-utils/network-fetch";

export async function mutateLogin(
    formData: FormData | null,
    loginId: string | undefined,
    method: "POST" | "PATCH" | "DELETE"
) {
    if (method !== "DELETE") {
        const passwordData = await encryptAES(
            formData!.get("login[login_password]")?.toString()!
        );
        formData!.set("login[login_password]", passwordData.encryptedData);
        formData!.set("login[iv]", passwordData.iv);
    }
    await networkFetch(
        "logins/" + (loginId ? loginId : ""),
        null,
        method,
        formData
    );
}
