export async function generateAESKey(password: string, salt: string) {
  const iterations = 100000;
  const preparedKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: new Uint8Array(
        atob(salt)
          .split("")
          .map((c) => c.charCodeAt(0))
      ),
      iterations,
    },
    preparedKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}
