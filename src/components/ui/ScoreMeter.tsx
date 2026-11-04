import { clampScore, RISK_THRESHOLDS, riskFromScore } from '../../lib/risk'
import { cx } from '../../lib/cx'

interface ScoreMeterProps {
  score: number
  label?: string
  showZones?: boolean
  compact?: boolean
  className?: string
}

export function ScoreMeter({
  score,
  label = 'Puntuación de riesgo',
  showZones = true,
  compact = false,
  className,
}: ScoreMeterProps) {
  const safeScore = clampScore(score)
  const risk = riskFromScore(safeScore)

  return (
    <div className={cx('score-meter', compact && 'score-meter--compact', className)}>
      <div className="score-meter__head">
        <span>{label}</span>
        <strong className={`score-meter__value score-meter__value--${risk}`}>
          {safeScore}
          <span>/100</span>
        </strong>
      </div>
      <div
        className="score-meter__track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeScore}
      >
        <div
          className={cx('score-meter__fill', `score-meter__fill--${risk}`)}
          style={{ width: `${safeScore}%` }}
        />
        <span
          className="score-meter__tick"
          style={{ left: `${RISK_THRESHOLDS.medium}%` }}
          aria-hidden="true"
        />
        <span
          className="score-meter__tick"
          style={{ left: `${RISK_THRESHOLDS.high}%` }}
          aria-hidden="true"
        />
      </div>
      {showZones ? (
        <div className="score-meter__zones" aria-hidden="true">
          <span>Bajo 0–29</span>
          <span>Medio 30–69</span>
          <span>Alto 70–100</span>
        </div>
      ) : null}
    </div>
  )
}
