import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppSettings, DomainListKind, PersistedDemoState, Rule, RuleId } from '../types'
import { initialRules } from '../data/rules'
import { initialAllowlist, initialBlocklist } from '../data/domains'
import { clearDemoState, loadDemoState, saveDemoState } from '../lib/storage'
import { AppStateContext, type AddDomainResult, type AppStateValue } from './appState'

const defaultSettings: AppSettings = {
  protectionEnabled: true,
  sensitivity: 'balanced',
  alertMedium: true,
  autoBlockHigh: true,
  desktopNotifications: false,
  analyzeNewTabs: true,
  showToolbarBadge: true,
  localStats: true,
}

function normalizeDomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0]
    .replace(/\.$/, '')
}

function isValidDomain(domain: string): boolean {
  if (!domain || domain.length > 253) return false
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4.test(domain)) {
    return domain.split('.').every((part) => Number(part) >= 0 && Number(part) <= 255)
  }
  return /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(domain)
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => {
    const stored = loadDemoState()
    const settings = { ...defaultSettings, ...(stored?.settings ?? {}) }
    const rules = initialRules.map((rule) => {
      const storedRule = stored?.rules?.find((candidate) => candidate.id === rule.id)
      return { ...rule, enabled: storedRule?.enabled ?? rule.enabled }
    })
    return {
      settings,
      rules,
      allowlist: stored?.allowlist ?? initialAllowlist,
      blocklist: stored?.blocklist ?? initialBlocklist,
    }
  })

  const [settings, setSettings] = useState<AppSettings>(initial.settings)
  const [rules, setRules] = useState<Rule[]>(initial.rules)
  const [allowlist, setAllowlist] = useState<string[]>(initial.allowlist)
  const [blocklist, setBlocklist] = useState<string[]>(initial.blocklist)

  useEffect(() => {
    const state: PersistedDemoState = { settings, rules, allowlist, blocklist }
    saveDemoState(state)
  }, [settings, rules, allowlist, blocklist])

  const setProtectionEnabled = useCallback((enabled: boolean) => {
    setSettings((current) => ({ ...current, protectionEnabled: enabled }))
  }, [])

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((current) => ({ ...current, ...patch }))
  }, [])

  const toggleRule = useCallback((id: RuleId) => {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)),
    )
  }, [])

  const addDomain = useCallback(
    (kind: DomainListKind, value: string): AddDomainResult => {
      const domain = normalizeDomain(value)
      if (!domain) {
        return { ok: false, message: 'Escribe un dominio para continuar.' }
      }
      if (!isValidDomain(domain)) {
        return { ok: false, message: 'El formato del dominio no es válido.' }
      }
      const currentList = kind === 'allowlist' ? allowlist : blocklist
      const otherList = kind === 'allowlist' ? blocklist : allowlist
      if (currentList.includes(domain)) {
        return { ok: false, message: 'Ese dominio ya está en esta lista.' }
      }
      if (otherList.includes(domain)) {
        return {
          ok: false,
          message: 'El dominio ya existe en la lista opuesta. Elimínalo primero.',
        }
      }
      if (kind === 'allowlist') {
        setAllowlist((current) => [...current, domain])
      } else {
        setBlocklist((current) => [...current, domain])
      }
      return { ok: true, message: `${domain} se añadió a la lista.`, domain }
    },
    [allowlist, blocklist],
  )

  const removeDomain = useCallback((kind: DomainListKind, domain: string) => {
    if (kind === 'allowlist') {
      setAllowlist((current) => current.filter((item) => item !== domain))
    } else {
      setBlocklist((current) => current.filter((item) => item !== domain))
    }
  }, [])

  const resetDemo = useCallback(() => {
    clearDemoState()
    setSettings(defaultSettings)
    setRules(initialRules)
    setAllowlist(initialAllowlist)
    setBlocklist(initialBlocklist)
  }, [])

  const value = useMemo<AppStateValue>(
    () => ({
      settings,
      rules,
      allowlist,
      blocklist,
      setProtectionEnabled,
      updateSettings,
      toggleRule,
      addDomain,
      removeDomain,
      resetDemo,
    }),
    [
      settings,
      rules,
      allowlist,
      blocklist,
      setProtectionEnabled,
      updateSettings,
      toggleRule,
      addDomain,
      removeDomain,
      resetDemo,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
