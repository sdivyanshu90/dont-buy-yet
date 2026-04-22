import { STORAGE_KEYS, appendStoredItem, readStoredJSON } from './persistence'

const MAX_EVENTS = 250

export function trackEvent(name, payload = {}) {
  const event = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    payload,
    createdAt: new Date().toISOString(),
  }

  appendStoredItem(STORAGE_KEYS.analytics, event, { limit: MAX_EVENTS })

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dby:analytics', { detail: event }))
  }

  return event
}

export function getAnalyticsEvents() {
  return readStoredJSON(STORAGE_KEYS.analytics, [])
}

export function getAnalyticsSummary() {
  const events = getAnalyticsEvents()

  const count = (name) => events.filter((event) => event.name === name).length

  return {
    tipsDecoded: count('decode_completed'),
    decodeShares: count('decode_shared'),
    tipTrialsCompleted: count('tip_trial_completed'),
    mythRoundsCompleted: count('myth_round_completed'),
    replayRunsCompleted: count('market_replay_completed'),
    onboardingCompleted: count('onboarding_completed'),
    companiesSearched: count('company_search_completed'),
  }
}