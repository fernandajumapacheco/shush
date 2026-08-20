// Deriva um domínio a partir do que a pessoa digitou (URL completa, "gmail.com" ou só "Gmail")
// e monta a URL do ícone oficial do site via serviço público de favicons do Google.
export function faviconUrl(siteInput) {
  const trimmed = siteInput.trim().toLowerCase()
  if (!trimmed) return null

  let domain = trimmed
    .replace(/^https?:\/\//, '')
    .split('/')[0]

  if (!domain.includes('.')) {
    domain = `${domain}.com`
  }

  return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
}
