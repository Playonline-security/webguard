import { ArrowLeft, ExternalLink, FileWarning, ShieldX } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SecurityEvent } from '../../types'
import { useAppState } from '../../context/useAppState'
import { formatDate, formatRelative, formatTime } from '../../lib/format'
import { getRecommendation, riskDescriptions } from '../../lib/risk'
import { Button, ButtonLink } from '../ui/Button'
import { RiskBadge, ResultBadge } from '../ui/Badge'
import { ScoreMeter } from '../ui/ScoreMeter'
import { IndicatorList } from '../ui/IndicatorList'

interface EventDetailProps {
  event: SecurityEvent
  onClose: () => void
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  const { rules } = useAppState()
  const activeRules = event.indicatorIds.filter(
    (id) => rules.find((rule) => rule.id === id)?.enabled ?? false,
  )
  const disabledCount = event.indicatorIds.length - activeRules.length

  return (
    <div className="event-detail">
      <div className="event-detail__top">
        <div className="event-detail__badges">
          <RiskBadge risk={event.risk} />
          <ResultBadge result={event.result} />
        </div>
        <span className="event-detail__id">{event.id}</span>
      </div>

      <div className="event-detail__site">
        <h3>{event.domain}</h3>
        <p className="mono-url">{event.url}</p>
        <p className="event-detail__time">
          {formatDate(event.timestamp)} · {formatRelative(event.timestamp)} · {formatTime(event.timestamp)}
        </p>
      </div>

      <ScoreMeter score={event.score} label="Puntuación del evento" />

      <div className="event-detail__summary">
        <h4>Resumen del análisis</h4>
        <p>{riskDescriptions[event.risk]}</p>
        <p>{getRecommendation(event.risk, event.result)}</p>
      </div>

      <div className="event-detail__section">
        <div className="section-heading">
          <h4>Indicadores detectados</h4>
          <span>{event.indicatorIds.length} en total</span>
        </div>
        <IndicatorList ids={event.indicatorIds} variant="full" />
        {disabledCount > 0 ? (
          <p className="event-detail__note">
            {disabledCount} {disabledCount === 1 ? 'regla está pausada' : 'reglas están pausadas'} en
            la configuración actual. El evento conserva el resultado del análisis simulado.
          </p>
        ) : null}
      </div>

      <div className="event-detail__actions">
        {event.risk !== 'safe' ? (
          <ButtonLink
            to={event.risk === 'high' ? '/demo/blocked' : '/demo/warning'}
            variant="secondary"
            size="sm"
          >
            {event.risk === 'high' ? (
              <ShieldX size={15} aria-hidden="true" />
            ) : (
              <FileWarning size={15} aria-hidden="true" />
            )}
            Ver pantalla asociada
          </ButtonLink>
        ) : null}
        <ButtonLink to={`/rules?highlight=${event.indicatorIds[0] ?? ''}`} variant="ghost" size="sm">
          Ver reglas de detección
          <ExternalLink size={14} aria-hidden="true" />
        </ButtonLink>
      </div>

      <div className="event-detail__back">
        <Button variant="quiet" size="sm" onClick={onClose}>
          <ArrowLeft size={14} aria-hidden="true" />
          Volver al historial
        </Button>
        <Link to="/events" className="text-link" onClick={onClose}>
          Cerrar detalle
        </Link>
      </div>
    </div>
  )
}
