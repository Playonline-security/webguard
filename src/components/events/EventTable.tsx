import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SecurityEvent } from '../../types'
import { formatShortDate, formatTime } from '../../lib/format'
import { RiskBadge, ResultBadge } from '../ui/Badge'

export function EventTable({ events }: { events: SecurityEvent[] }) {
  return (
    <div className="event-table">
      <div className="event-table__head" aria-hidden="true">
        <span>Sitio y URL</span>
        <span>Fecha</span>
        <span>Riesgo</span>
        <span>Resultado</span>
        <span>Indicadores</span>
        <span />
      </div>
      <ul className="event-table__body">
        {events.map((event) => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`} className="event-row">
              <span className="event-row__site">
                <span className="event-row__domain">{event.domain}</span>
                <span className="event-row__url">{event.url}</span>
                <span className="event-row__mobile-meta">
                  {event.id} · {formatShortDate(event.timestamp)}
                </span>
              </span>
              <span className="event-row__date">
                <strong>{formatShortDate(event.timestamp)}</strong>
                <span>{formatTime(event.timestamp)}</span>
              </span>
              <span>
                <RiskBadge risk={event.risk} size="sm" short />
              </span>
              <span>
                <ResultBadge result={event.result} />
              </span>
              <span className="event-row__indicators">
                {event.indicatorIds.length === 0 ? (
                  <span className="event-row__none">Ninguno</span>
                ) : (
                  <>
                    {event.indicatorIds.slice(0, 3).map((id) => (
                      <span className="indicator-code" key={id}>
                        {id}
                      </span>
                    ))}
                    {event.indicatorIds.length > 3 ? (
                      <span className="indicator-code indicator-code--more">
                        +{event.indicatorIds.length - 3}
                      </span>
                    ) : null}
                  </>
                )}
              </span>
              <ChevronRight className="event-row__chevron" size={17} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
