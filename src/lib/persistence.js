export const STORAGE_KEYS = {
  analytics: 'dby.analytics.v1',
  onboarding: 'dby.onboarding.v1',
  decodeHistory: 'dby.decode-history.v1',
  stats: 'dby.stats.v1',
}

function isBrowser() {
  return typeof window !== 'undefined'
}

function emitStorageEvent(key, value) {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent('dby:storage', { detail: { key, value } }))
}

export function readStoredJSON(key, fallbackValue) {
  if (!isBrowser()) return fallbackValue

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallbackValue
  } catch {
    return fallbackValue
  }
}

export function writeStoredJSON(key, value) {
  if (!isBrowser()) return value

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    emitStorageEvent(key, value)
  } catch {
    return value
  }

  return value
}

export function updateStoredJSON(key, updater, fallbackValue) {
  const current = readStoredJSON(key, fallbackValue)
  const next = updater(current)
  return writeStoredJSON(key, next)
}

export function appendStoredItem(key, item, options = {}) {
  const { limit = 20 } = options
  return updateStoredJSON(
    key,
    (current) => {
      const existing = Array.isArray(current) ? current : []
      return [item, ...existing].slice(0, limit)
    },
    [],
  )
}

export function updateFeatureStats(featureKey, updater) {
  return updateStoredJSON(
    STORAGE_KEYS.stats,
    (current) => {
      const base = current && typeof current === 'object' ? current : {}
      const nextFeatureStats = updater(base[featureKey] || {})
      return { ...base, [featureKey]: nextFeatureStats }
    },
    {},
  )
}

export function getFeatureStats() {
  return readStoredJSON(STORAGE_KEYS.stats, {})
}

export function appendDecodeHistory(entry) {
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  }

  return appendStoredItem(STORAGE_KEYS.decodeHistory, item, { limit: 8 })
}

export function getDecodeHistory() {
  return readStoredJSON(STORAGE_KEYS.decodeHistory, [])
}