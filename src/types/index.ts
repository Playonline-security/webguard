export type RiskLevel = 'safe' | 'medium' | 'high'

export type AnalysisResult = 'allowed' | 'warned' | 'blocked'

export type RuleCategory = 'url' | 'connection' | 'content'

export type RuleId =
  | 'IND01'
  | 'IND02'
  | 'IND03'
  | 'IND04'
  | 'IND05'
  | 'IND06'
  | 'IND07'
  | 'IND08'
  | 'IND09'

export interface Rule {
  id: RuleId
  name: string
  description: string
  detail: string
  points: number
  category: RuleCategory
  enabled: boolean
}

export interface SecurityEvent {
  id: string
  domain: string
  url: string
  timestamp: string
  score: number
  risk: RiskLevel
  result: AnalysisResult
  indicatorIds: RuleId[]
}

export interface SiteScenario {
  id: string
  label: string
  domain: string
  url: string
  score: number
  risk: RiskLevel
  summary: string
  recommendation: string
  reasons: string[]
  indicatorIds: RuleId[]
}

export type PopupScenarioId = 'idle' | 'safe' | 'medium' | 'high' | 'disabled' | 'scanning'

export interface PopupScenario {
  id: PopupScenarioId
  label: string
  shortLabel: string
  description: string
  domain: string
  url: string
  score: number
  risk: RiskLevel
  summary: string
  indicatorIds: RuleId[]
}

export type Period = '24h' | '7d' | '30d'

export interface PeriodStats {
  period: Period
  label: string
  shortLabel: string
  analyzed: number
  safe: number
  medium: number
  high: number
  threats: number
  blocked: number
  protectionRate: number
  avgMs: number
  deltas: {
    analyzed: number
    threats: number
    blocked: number
  }
  activity: {
    labels: string[]
    analyzed: number[]
    threats: number[]
  }
}

export interface AppSettings {
  protectionEnabled: boolean
  sensitivity: 'low' | 'balanced' | 'high'
  alertMedium: boolean
  autoBlockHigh: boolean
  desktopNotifications: boolean
  analyzeNewTabs: boolean
  showToolbarBadge: boolean
  localStats: boolean
}

export interface PersistedDemoState {
  settings: AppSettings
  rules: Rule[]
  allowlist: string[]
  blocklist: string[]
}

export type DomainListKind = 'allowlist' | 'blocklist'
