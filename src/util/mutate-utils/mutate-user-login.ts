import { generateAESKey } from "@/util/crypt-utils/generate-aes-key";
import { keyStore } from "@/util/crypt-utils/key-store";
import { decryptAES } from "@/util/crypt-utils/cryptography";
import { getPrivateKeyFromBase64 } from "@/util/crypt-utils/get-private-rsa-key-from-base64";

export async function mutateUserLogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            user: {
                email,
                password,
            },
        }),
    });
    if (!response.ok) {
        throw Error(await response.json().then((data) => data.error));
    }
    const data = response.headers.get("Authorization");
    if (data) {
        const json = await response.json();
        localStorage.setItem("token", data);
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 30);
        localStorage.setItem("expiration", expiration.toString());
        keyStore.key = await generateAESKey(password?.toString()!, json.salt);
        const decryptedBase64Key = await decryptAES(
            json.private_key,
            json.private_key_iv
        );
        keyStore.privateKey = await getPrivateKeyFromBase64(decryptedBase64Key);
        window.addEventListener("beforeunload", () => localStorage.clear());
    }
}
