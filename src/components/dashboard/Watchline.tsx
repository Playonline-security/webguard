import { type CSSProperties } from 'react'
import { mockEvents } from '../../data/events'
import type { RiskLevel } from '../../types'
import { cx } from '../../lib/cx'

const WINDOW_MS = 24 * 60 * 60 * 1000
const BUCKETS = 48

const riskWeight: Record<RiskLevel, number> = { safe: 1, medium: 2, high: 3 }

function buildWatchline() {
  const now = Date.now()
  const values: RiskLevel[] = Array.from({ length: BUCKETS }, () => 'safe')
  const touched = new Set<number>()

  mockEvents.forEach((event) => {
    const age = now - new Date(event.timestamp).getTime()
    if (age < 0 || age > WINDOW_MS) return
    const index = Math.min(
      BUCKETS - 1,
      Math.max(0, BUCKETS - 1 - Math.floor(age / (WINDOW_MS / BUCKETS))),
    )
    if (!touched.has(index) || riskWeight[event.risk] > riskWeight[values[index]]) {
      values[index] = event.risk
    }
    touched.add(index)
  })

  return values.map((risk, index) => ({ risk, active: touched.has(index), index }))
}

const buckets = buildWatchline()

export function Watchline({ enabled }: { enabled: boolean }) {
  return (
    <div className={cx('watchline', !enabled && 'is-paused')}>
      <div className="watchline__head">
        <span>Actividad de las últimas 24 horas</span>
        <span className="watchline__legend">
          <span><i className="dot dot--safe" />Sin riesgo</span>
          <span><i className="dot dot--medium" />Medio</span>
          <span><i className="dot dot--high" />Alto</span>
        </span>
      </div>
      <div
        className="watchline__track"
        role="img"
        aria-label={`Línea de actividad de las últimas 24 horas con ${buckets.filter((bucket) => bucket.active).length} marcas de eventos.`}
      >
        {buckets.map((bucket) => (
          <span
            key={bucket.index}
            className={cx(
              'watchline__tick',
              bucket.active && `is-${bucket.risk}`,
              bucket.active && 'is-active',
            )}
            style={{ '--i': bucket.index } as CSSProperties}
            title={
              bucket.active
                ? `Evento de riesgo ${bucket.risk === 'safe' ? 'bajo' : bucket.risk === 'medium' ? 'medio' : 'alto'}`
                : 'Sin eventos'
            }
          />
        ))}
      </div>
      <div className="watchline__scale">
        <span>Hace 24 h</span>
        <span>Ahora</span>
      </div>
      {!enabled ? (
        <p className="watchline__paused">La protección está en pausa: no se registran nuevos eventos.</p>
      ) : null}
    </div>
  )
}
