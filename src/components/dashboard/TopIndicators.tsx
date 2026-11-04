import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { topIndicators } from '../../data/stats'
import { useAppState } from '../../context/useAppState'

export function TopIndicators() {
  const { rules } = useAppState()
  const max = Math.max(...topIndicators.map((indicator) => indicator.count))

  return (
    <div className="top-indicators">
      <div className="panel-heading">
        <div>
          <h3 className="panel-title">Indicadores más frecuentes</h3>
          <p className="panel-subtitle">Señales detectadas en los últimos 7 días.</p>
        </div>
        <Link to="/rules" className="text-link">
          Ver reglas <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <ul className="top-indicators__list">
        {topIndicators.map((indicator) => {
          const rule = rules.find((candidate) => candidate.id === indicator.id)
          return (
            <li key={indicator.id}>
              <div className="top-indicators__row">
                <span className="mono-label">{indicator.id}</span>
                <span className="top-indicators__name">{rule?.name ?? indicator.id}</span>
                <span className="top-indicators__count">{indicator.count}</span>
              </div>
              <div className="top-indicators__track" aria-hidden="true">
                <span style={{ width: `${(indicator.count / max) * 100}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
