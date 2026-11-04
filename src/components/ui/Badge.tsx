import type { ReactNode } from 'react'
import { CheckCircle2, ShieldCheck, ShieldX, TriangleAlert } from 'lucide-react'
import type { AnalysisResult, RiskLevel } from '../../types'
import { resultLabels, riskLabels, riskShortLabels } from '../../lib/risk'
import { cx } from '../../lib/cx'

const riskIcons = {
  safe: ShieldCheck,
  medium: TriangleAlert,
  high: ShieldX,
} as const

export function RiskBadge({
  risk,
  short = false,
  size = 'md',
  className,
}: {
  risk: RiskLevel
  short?: boolean
  size?: 'sm' | 'md'
  className?: string
}) {
  const Icon = riskIcons[risk]
  return (
    <span className={cx('risk-badge', `risk-badge--${risk}`, `risk-badge--${size}`, className)}>
      <Icon size={size === 'sm' ? 13 : 15} strokeWidth={2.2} aria-hidden="true" />
      {short ? riskShortLabels[risk] : riskLabels[risk]}
    </span>
  )
}

const resultIcons = {
  allowed: CheckCircle2,
  warned: TriangleAlert,
  blocked: ShieldX,
} as const

export function ResultBadge({ result }: { result: AnalysisResult }) {
  const Icon = resultIcons[result]
  return (
    <span className={cx('result-badge', `result-badge--${result}`)}>
      <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
      {resultLabels[result]}
    </span>
  )
}

export function CountBadge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'brand' | 'danger'
}) {
  return <span className={cx('count-badge', `count-badge--${tone}`)}>{children}</span>
}
