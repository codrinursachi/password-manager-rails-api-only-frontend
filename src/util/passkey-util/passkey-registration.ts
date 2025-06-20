import { base64UrlToBuffer, bufferToBase64Url } from "../conversion-utils";
import { generateSalt } from "../crypt-utils/generate-salt";
import { keyStore } from "../crypt-utils/key-store";
import { generateAESKey } from "../crypt-utils/generate-aes-key";
import { decryptAES, encryptAES } from "../crypt-utils/cryptography";
import { getPrivateKeyFromBase64 } from "../crypt-utils/get-private-rsa-key-from-base64";
import { generateBase64RSAPair } from "../crypt-utils/generate-base64-rsa";

const startRegistration = async (email: string, name: string) => {
    const salt = generateSalt();
    const response = await fetch("/api/v1/webauthn/registration_options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            name,
            salt,
        }),
    });
    if (!response.ok) {
        throw new Error(await response.json().then((data) => data.error));
    }
    let { creation_options: creationOptions, challenge_token: challengeToken } =
        await response.json();

    creationOptions.challenge = base64UrlToBuffer(creationOptions.challenge);
    creationOptions.user.id = new TextEncoder().encode(creationOptions.user.id);

    const credential = await navigator.credentials.create({
        publicKey: creationOptions,
    });
    if (!credential) {
        throw new Error("Failed to create credentials");
    }
    keyStore.key = await generateAESKey(credential.id.toString(), salt);
    const { publicKey, privateKey } = await generateBase64RSAPair();
    keyStore.privateKey = await getPrivateKeyFromBase64(privateKey);
    const encryptedPrivateKeyWithIv = await encryptAES(privateKey);
    const publicKeyCredential = {
        id: credential.id,
        rawId: bufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
            attestationObject: bufferToBase64Url(
                credential.response.attestationObject
            ),
            clientDataJSON: bufferToBase64Url(
                credential.response.clientDataJSON
            ),
        },
    };

    const verification = await fetch("/api/v1/webauthn/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            publicKeyCredential,
            challenge_token: challengeToken,
            rsa_attributes: {
                public_key: publicKey,
                private_key: encryptedPrivateKeyWithIv.encryptedData,
                private_key_iv: encryptedPrivateKeyWithIv.iv,
            },
        }),
    });
    if (!verification.ok) {
        const errData = await verification.json();
        throw new Error(errData.error || "Registration failed");
    }
    const result = await verification.json();
    const data = verification.headers.get("Authorization");
    if (data) {
        localStorage.setItem("token", data);
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 30);
        localStorage.setItem("expiration", expiration.toString());
        keyStore.key = await generateAESKey(credential.id, result.salt);
        const decryptedBase64Key = await decryptAES(
            result.private_key,
            result.private_key_iv
        );
        keyStore.privateKey = await getPrivateKeyFromBase64(decryptedBase64Key);
        window.addEventListener("beforeunload", () => localStorage.clear());
    }
    return true;
};
export default startRegistration;
