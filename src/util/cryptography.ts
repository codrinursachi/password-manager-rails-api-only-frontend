import { keyStore } from "./key-store";

export async function encryptAES(password: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedPassword = new TextEncoder().encode(password);
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    keyStore.key!,
    encodedPassword
  );
  return {
    iv: btoa(String.fromCharCode(...iv)),
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
  };
}

export async function decryptAES(encryptedData: string, iv: string) {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(
        atob(iv)
          .split("")
          .map((c) => c.charCodeAt(0))
      ),
    },
    keyStore.key!,
    new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((c) => c.charCodeAt(0))
    )
  );
  return new TextDecoder().decode(decryptedData);
}

export async function encryptRSAPassword(password: string, publicKey: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const key = await window.crypto.subtle.importKey(
    "spki",
    Uint8Array.from(atob(publicKey), (c) => c.charCodeAt(0)),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    data
  );
  return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
}

export async function decryptRSAPassword(encryptedData: string) {
  const decoder = new TextDecoder();
  const data = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    keyStore.privateKey!,
    data
  );
  return decoder.decode(decryptedData);
}
