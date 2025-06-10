import { generateSalt } from "@/util/crypt-utils/generate-salt";
import { generateAESKey } from "@/util/crypt-utils/generate-aes-key";
import { keyStore } from "@/util/crypt-utils/key-store";
import { generateBase64RSAPair } from "@/util/crypt-utils/generate-base64-rsa";
import { encryptAES } from "@/util/crypt-utils/cryptography";
import { getPrivateKeyFromBase64 } from "@/util/crypt-utils/get-private-rsa-key-from-base64";

export async function mutateRegistration(formData: FormData) {
    const email = formData.get("email");
    const name = formData.get("name");
    const password = formData.get("password")!;
    const passwordConfirmation = formData.get("password-confirmation");
    if (password !== passwordConfirmation) {
        throw new Error("Passwords do not match");
    }
    const salt = generateSalt();
    keyStore.key = await generateAESKey(password.toString(), salt);
    const { publicKey, privateKey } = await generateBase64RSAPair();
    keyStore.privateKey = await getPrivateKeyFromBase64(privateKey);
    const encryptedPrivateKeyWithIv = await encryptAES(privateKey);
    const response = await fetch("/api/v1/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            user: {
                email,
                password,
                password_confirmation: passwordConfirmation,
                name,
                salt,
                rsa_attributes: {
                    public_key: publicKey,
                    private_key: encryptedPrivateKeyWithIv.encryptedData,
                    private_key_iv: encryptedPrivateKeyWithIv.iv,
                },
            },
        }),
    });
    if (!response.ok) {
        const error: { [key: string]: string[] } = await response
            .json()
            .then((data) => data.error);
        const key = Object.keys(error)[0];
        throw new Error(
            key[0].toUpperCase() + key.slice(1) + " " + error[key]?.[0]
        );
    }
    const data = response.headers.get("Authorization");
    if (data) {
        localStorage.setItem("token", data);
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 30);
        localStorage.setItem("expiration", expiration.toString());
        localStorage.setItem("salt", salt);
        window.addEventListener("beforeunload", () => localStorage.clear());
    }
}
