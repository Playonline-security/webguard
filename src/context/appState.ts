import { createContext } from 'react'
import type { AppSettings, DomainListKind, Rule, RuleId } from '../types'

export interface AddDomainResult {
  ok: boolean
  message: string
  domain?: string
}

export interface AppStateValue {
  settings: AppSettings
  rules: Rule[]
  allowlist: string[]
  blocklist: string[]
  setProtectionEnabled: (enabled: boolean) => void
  updateSettings: (patch: Partial<AppSettings>) => void
  toggleRule: (id: RuleId) => void
  addDomain: (kind: DomainListKind, value: string) => AddDomainResult
  removeDomain: (kind: DomainListKind, domain: string) => void
  resetDemo: () => void
}

export const AppStateContext = createContext<AppStateValue | null>(null)
