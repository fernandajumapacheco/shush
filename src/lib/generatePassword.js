const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%&*?+-='

export function generatePassword({ length = 16, useUpper = true, useNumbers = true, useSymbols = true }) {
  let charset = LOWER
  if (useUpper) charset += UPPER
  if (useNumbers) charset += NUMBERS
  if (useSymbols) charset += SYMBOLS

  const randomValues = crypto.getRandomValues(new Uint32Array(length))
  return Array.from(randomValues, (n) => charset[n % charset.length]).join('')
}

export function passwordStrengthScore(password) {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 14) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}
