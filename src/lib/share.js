export function getAppOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return 'https://dont-buy-yet.app'
}

export function buildDecodeTipLink({ tip = '', source = 'whatsapp' } = {}) {
  const url = new URL('/decode-tip', getAppOrigin())

  if (tip) {
    url.searchParams.set('tip', tip)
  }

  if (source) {
    url.searchParams.set('source', source)
  }

  return url.toString()
}

export function buildWhatsAppShareUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function openWhatsAppShare(text) {
  if (typeof window === 'undefined') return
  window.open(buildWhatsAppShareUrl(text), '_blank', 'noopener,noreferrer')
}