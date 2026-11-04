import type { PersistedDemoState } from '../types'

const STORAGE_KEY = 'webguard-demo-state-v1'

export function loadDemoState(): Partial<PersistedDemoState> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<PersistedDemoState>
  } catch {
    return null
  }
}

export function saveDemoState(state: PersistedDemoState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // El prototipo puede seguir funcionando sin persistencia.
  }
}

export function clearDemoState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Sin persistencia disponible.
  }
}
