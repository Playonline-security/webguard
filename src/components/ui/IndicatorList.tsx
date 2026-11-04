import { CheckCircle2 } from 'lucide-react'
import type { RuleId } from '../../types'
import { useAppState } from '../../context/useAppState'
import { cx } from '../../lib/cx'

interface IndicatorListProps {
  ids: RuleId[]
  variant?: 'compact' | 'full'
  emptyLabel?: string
  className?: string
}

export function IndicatorList({
  ids,
  variant = 'compact',
  emptyLabel = 'Sin indicadores detectados',
  className,
}: IndicatorListProps) {
  const { rules } = useAppState()

  if (ids.length === 0) {
    return (
      <div className={cx('indicator-empty', className)}>
        <CheckCircle2 size={17} aria-hidden="true" />
        <span>{emptyLabel}</span>
      </div>
    )
  }

  return (
    <ul className={cx('indicator-list', `indicator-list--${variant}`, className)}>
      {ids.map((id) => {
        const rule = rules.find((candidate) => candidate.id === id)
        if (!rule) return null
        return (
          <li className="indicator" key={id}>
            <span className="indicator__id">{rule.id}</span>
            <span className="indicator__body">
              <span className="indicator__name">{rule.name}</span>
              {variant === 'full' ? (
                <span className="indicator__description">{rule.description}</span>
              ) : null}
            </span>
            <span className="indicator__points">+{rule.points}</span>
          </li>
        )
      })}
    </ul>
  )
}
