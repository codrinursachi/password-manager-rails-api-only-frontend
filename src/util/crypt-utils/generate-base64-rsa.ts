export async function generateBase64RSAPair() {
  const { publicKey, privateKey } = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedPublicKey = await crypto.subtle.exportKey("spki", publicKey);
  const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", privateKey);

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey))),
    privateKey: btoa(
      String.fromCharCode(...new Uint8Array(exportedPrivateKey))
    ),
  };
}
