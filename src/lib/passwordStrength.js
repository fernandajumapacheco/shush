// Regras mínimas para a senha-mestra: ela protege tudo, então precisa ser forte.
export function checkPasswordStrength(password) {
  if (password.length < 12) {
    return 'A senha-mestra precisa ter pelo menos 12 caracteres.'
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return 'Use letras maiúsculas e minúsculas na senha-mestra.'
  }
  if (!/[0-9]/.test(password)) {
    return 'Inclua pelo menos um número na senha-mestra.'
  }
  return null
}
