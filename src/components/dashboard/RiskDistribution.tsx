import type { PeriodStats } from '../../types'
import { formatNumber } from '../../lib/format'

const segments = [
  { key: 'safe', label: 'Sin riesgo', className: 'safe' },
  { key: 'medium', label: 'Riesgo medio', className: 'medium' },
  { key: 'high', label: 'Riesgo alto', className: 'high' },
] as const

export function RiskDistribution({ stats }: { stats: PeriodStats }) {
  const total = stats.safe + stats.medium + stats.high || 1

  return (
    <div className="risk-distribution">
      <div className="panel-heading">
        <div>
          <h3 className="panel-title">Distribución por riesgo</h3>
          <p className="panel-subtitle">Resultado de los sitios analizados en {stats.shortLabel}.</p>
        </div>
      </div>

      <div
        className="risk-distribution__bar"
        role="img"
        aria-label={`${formatNumber(stats.safe)} sitios sin riesgo, ${formatNumber(stats.medium)} de riesgo medio y ${formatNumber(stats.high)} de riesgo alto.`}
      >
        {segments.map((segment) => {
          const value = stats[segment.key]
          const width = (value / total) * 100
          return (
            <span
              key={segment.key}
              className={`risk-distribution__segment is-${segment.className}`}
              style={{ width: `${Math.max(width, 0.7)}%` }}
              title={`${segment.label}: ${formatNumber(value)}`}
            />
          )
        })}
      </div>

      <ul className="risk-distribution__list">
        {segments.map((segment) => {
          const value = stats[segment.key]
          const percent = (value / total) * 100
          return (
            <li key={segment.key}>
              <span className="risk-distribution__label">
                <i className={`dot dot--${segment.className}`} aria-hidden="true" />
                {segment.label}
              </span>
              <span className="risk-distribution__numbers">
                <strong>{formatNumber(value)}</strong>
                <span>{percent.toLocaleString('es-CL', { maximumFractionDigits: 1 })} %</span>
              </span>
            </li>
          )
        })}
      </ul>

      <div className="risk-distribution__foot">
        <span>Total analizado</span>
        <strong>{formatNumber(total)}</strong>
      </div>
    </div>
  )
}
