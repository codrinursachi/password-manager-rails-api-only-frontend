import { base64UrlToBuffer, bufferToBase64Url } from "../conversion-utils";
import { keyStore } from "../crypt-utils/key-store";
import { generateAESKey } from "../crypt-utils/generate-aes-key";
import { decryptAES } from "../crypt-utils/cryptography";
import { getPrivateKeyFromBase64 } from "../crypt-utils/get-private-rsa-key-from-base64";

const startAuthentication = async (email: string) => {
    const response = await fetch("/api/v1/webauthn/authentication_options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
    }
    let { request_options: requestOptions, challenge_token: challengeToken } =
        await response.json();
    requestOptions.challenge = base64UrlToBuffer(requestOptions.challenge);

    if (
        requestOptions.allowCredentials &&
        requestOptions.allowCredentials.length > 0
    ) {
        requestOptions.allowCredentials[0].id = base64UrlToBuffer(
            requestOptions.allowCredentials[0].id
        );
    }

    const assertion = await navigator.credentials.get({
        publicKey: requestOptions,
    });
    if (!assertion) {
        throw new Error("Failed to get assertion");
    }

    const publicKeyCredential = {
        id: assertion.id,
        rawId: bufferToBase64Url(assertion.rawId),
        type: assertion.type,
        response: {
            authenticatorData: bufferToBase64Url(
                assertion.response.authenticatorData
            ),
            clientDataJSON: bufferToBase64Url(
                assertion.response.clientDataJSON
            ),
            signature: bufferToBase64Url(assertion.response.signature),
            userHandle: assertion.response.userHandle
                ? bufferToBase64Url(assertion.response.userHandle)
                : null,
        },
    };

    const verification = await fetch("/api/v1/webauthn/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            publicKeyCredential,
            challenge_token: challengeToken,
        }),
    });
    const result = await verification.json();
    if (!verification.ok) {
        throw new Error(result.error || "Authentication failed");
    }
    const data = verification.headers.get("Authorization");
    if (data) {
        localStorage.setItem("token", data);
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 30);
        localStorage.setItem("expiration", expiration.toString());
        keyStore.key = await generateAESKey(assertion.id, result.salt);
        const decryptedBase64Key = await decryptAES(
            result.private_key,
            result.private_key_iv
        );
        keyStore.privateKey = await getPrivateKeyFromBase64(decryptedBase64Key);
        window.addEventListener("beforeunload", () => localStorage.clear());
    }
    return true;
};

export default startAuthentication;
