import { useMemo, useState } from 'react'
import type { PeriodStats } from '../../types'
import { formatNumber } from '../../lib/format'
import { cx } from '../../lib/cx'

const WIDTH = 640
const HEIGHT = 232
const PADDING = { top: 20, right: 18, bottom: 32, left: 48 }

function niceMax(value: number): number {
  if (value <= 0) return 10
  const step = Math.pow(10, Math.floor(Math.log10(value)))
  const normalized = value / step
  const multiplier = normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return multiplier * step
}

export function ActivityChart({ stats }: { stats: PeriodStats }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { labels, analyzed, threats } = stats.activity

  const chart = useMemo(() => {
    const innerWidth = WIDTH - PADDING.left - PADDING.right
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom
    const maxValue = niceMax(Math.max(...analyzed) * 1.12)
    const stepX = labels.length > 1 ? innerWidth / (labels.length - 1) : 0
    const points = analyzed.map((value, index) => ({
      x: PADDING.left + stepX * index,
      y: PADDING.top + innerHeight - (value / maxValue) * innerHeight,
      value,
      threat: threats[index] ?? 0,
      label: labels[index] ?? '',
    }))
    const line = points.map((point) => `${point.x},${point.y}`).join(' ')
    const area = `M ${PADDING.left} ${PADDING.top + innerHeight} L ${points
      .map((point) => `${point.x} ${point.y}`)
      .join(' L ')} L ${PADDING.left + innerWidth} ${PADDING.top + innerHeight} Z`
    const grid = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
      y: PADDING.top + innerHeight * ratio,
      value: Math.round(maxValue * (1 - ratio)),
    }))
    return { innerWidth, innerHeight, maxValue, points, line, area, grid, stepX }
  }, [analyzed, labels, threats])

  const active = activeIndex !== null ? chart.points[activeIndex] : null

  return (
    <div className="chart">
      <div className="chart__head">
        <div>
          <h3 className="panel-title">Sitios analizados</h3>
          <p className="panel-subtitle">Volumen de análisis y amenazas por intervalo.</p>
        </div>
        <div className="chart__summary">
          <span className="chart__summary-value">{formatNumber(stats.analyzed)}</span>
          <span className="chart__summary-label">
            análisis · {formatNumber(stats.threats)} amenazas
          </span>
        </div>
      </div>

      <div className="chart__canvas">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="chart__svg"
          role="img"
          aria-label={`Gráfico de ${stats.label.toLowerCase()}: ${stats.analyzed} sitios analizados y ${stats.threats} amenazas detectadas.`}
        >
          {chart.grid.map((line) => (
            <g key={line.y}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={line.y}
                y2={line.y}
                className="chart__grid"
              />
              <text x={PADDING.left - 10} y={line.y + 4} textAnchor="end" className="chart__axis">
                {formatNumber(line.value)}
              </text>
            </g>
          ))}

          <path d={chart.area} className="chart__area" />
          <polyline points={chart.line} className="chart__line" fill="none" />

          {chart.points.map((point, index) => (
            <g key={`${point.label}-${index}`}>
              <rect
                x={point.x - chart.stepX / 2}
                y={PADDING.top}
                width={Math.max(chart.stepX, 20)}
                height={chart.innerHeight}
                className="chart__hit"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <title>{`${point.label}: ${formatNumber(point.value)} análisis, ${point.threat} amenazas`}</title>
              </rect>
              <circle
                cx={point.x}
                cy={point.y}
                r={activeIndex === index ? 5.5 : 3.2}
                className={cx('chart__point', activeIndex === index && 'is-active')}
              />
              <text
                x={point.x}
                y={HEIGHT - 9}
                textAnchor="middle"
                className="chart__axis chart__axis--x"
              >
                {point.label}
              </text>
            </g>
          ))}

          {active ? (
            <line
              x1={active.x}
              x2={active.x}
              y1={PADDING.top}
              y2={PADDING.top + chart.innerHeight}
              className="chart__guide"
            />
          ) : null}
        </svg>
        {active ? (
          <div
            className="chart__tooltip"
            style={{
              left: `${(active.x / WIDTH) * 100}%`,
              top: `${(active.y / HEIGHT) * 100}%`,
            }}
          >
            <strong>{active.label}</strong>
            <span>{formatNumber(active.value)} análisis</span>
            <span>{active.threat} amenazas</span>
          </div>
        ) : null}
      </div>

      <div className="chart__foot">
        <span>
          <i className="chart__key chart__key--line" aria-hidden="true" />
          Sitios analizados
        </span>
        <span className="chart__foot-note">
          Tiempo medio de análisis: <strong>{stats.avgMs} ms</strong>
        </span>
      </div>
    </div>
  )
}
