import type { AnalysisResult, RiskLevel, Rule, RuleCategory, RuleId } from '../types'

export const RISK_THRESHOLDS = {
  medium: 30,
  high: 70,
} as const

export function riskFromScore(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.high) return 'high'
  if (score >= RISK_THRESHOLDS.medium) return 'medium'
  return 'safe'
}

export const riskLabels: Record<RiskLevel, string> = {
  safe: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
}

export const riskShortLabels: Record<RiskLevel, string> = {
  safe: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
}

export const riskDescriptions: Record<RiskLevel, string> = {
  safe: 'No se detectaron señales relevantes en este sitio.',
  medium: 'Hay señales que conviene revisar antes de continuar.',
  high: 'Se combinaron varios indicadores de riesgo crítico.',
}

export const resultLabels: Record<AnalysisResult, string> = {
  allowed: 'Permitido',
  warned: 'Advertencia mostrada',
  blocked: 'Bloqueado',
}

export const categoryLabels: Record<RuleCategory, string> = {
  url: 'Estructura de la URL',
  connection: 'Conexión y dominio',
  content: 'Contenido y suplantación',
}

export const categoryDescriptions: Record<RuleCategory, string> = {
  url: 'Cómo está construida la dirección que visitas.',
  connection: 'La legitimidad del dominio y de su conexión.',
  content: 'Señales de imitación y formularios que piden datos.',
}

export function getRule(rules: Rule[], id: RuleId): Rule | undefined {
  return rules.find((rule) => rule.id === id)
}

export function sumPoints(rules: Rule[], ids: RuleId[]): number {
  return ids.reduce((total, id) => total + (getRule(rules, id)?.points ?? 0), 0)
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getRecommendation(risk: RiskLevel, result: AnalysisResult): string {
  if (result === 'blocked' || risk === 'high') {
    return 'No continúes a este sitio. Vuelve a una página segura y, si el acceso era necesario, verifica la dirección con tu equipo de TI.'
  }
  if (result === 'warned') {
    return 'Comprueba el dominio antes de introducir datos. Si no lo esperabas, cierra la página y vuelve a un sitio de confianza.'
  }
  return 'Puedes continuar con normalidad. WebGuard seguirá analizando la navegación de esta pestaña.'
}
