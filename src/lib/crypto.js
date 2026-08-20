const ITERATIONS = 250000
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(base64) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

async function deriveKey(masterPassword, salt) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(masterPassword),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

// Criptografa um texto com a senha-mestra. Retorna tudo que é preciso
// para decifrar depois (salt e iv), já que cada criptografia usa valores novos.
export async function encrypt(plainText, masterPassword) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(masterPassword, salt)

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plainText)
  )

  return {
    cipherText: toBase64(new Uint8Array(cipherBuffer)),
    salt: toBase64(salt),
    iv: toBase64(iv),
  }
}

export async function decrypt({ cipherText, salt, iv }, masterPassword) {
  const key = await deriveKey(masterPassword, fromBase64(salt))

  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(iv) },
    key,
    fromBase64(cipherText)
  )

  return decoder.decode(plainBuffer)
}
