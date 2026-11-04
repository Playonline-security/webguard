import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockEvents } from '../../data/events'
import { formatRelative } from '../../lib/format'
import { RiskBadge, ResultBadge } from '../ui/Badge'

export function RecentEvents() {
  const events = mockEvents.slice(0, 6)

  return (
    <div className="recent-events">
      <div className="panel-heading">
        <div>
          <h3 className="panel-title">Eventos recientes</h3>
          <p className="panel-subtitle">Últimos análisis registrados en este navegador.</p>
        </div>
        <Link to="/events" className="text-link">
          Ver historial completo <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="recent-events__head" aria-hidden="true">
        <span>Sitio</span>
        <span>Riesgo</span>
        <span>Resultado</span>
        <span>Hace</span>
        <span />
      </div>

      <ul className="recent-events__list">
        {events.map((event) => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`} className="recent-events__row">
              <span className="recent-events__site">
                <span className="recent-events__domain">{event.domain}</span>
                <span className="recent-events__meta">
                  {event.id} · {event.indicatorIds.length} indicadores
                </span>
              </span>
              <span>
                <RiskBadge risk={event.risk} short size="sm" />
              </span>
              <span>
                <ResultBadge result={event.result} />
              </span>
              <span className="recent-events__time">{formatRelative(event.timestamp)}</span>
              <ArrowRight className="recent-events__arrow" size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
