export async function getPrivateKeyFromBase64(base64Key: string) {
  const key = new Uint8Array(
    atob(base64Key)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  return await window.crypto.subtle.importKey(
    "pkcs8",
    key,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    false,
    ["decrypt"]
  );
}
