import type { Period, PeriodStats } from '../types'

/**
 * DATOS SIMULADOS.
 * Las cifras agregadas no provienen de tráfico real ni de un motor de detección.
 */
const weekday = new Intl.DateTimeFormat('es-CL', { weekday: 'short', day: 'numeric' })

function recentDayLabels(days: number): string[] {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - index))
    return weekday.format(date).replace('.', '')
  })
}

export const statsByPeriod: Record<Period, PeriodStats> = {
  '24h': {
    period: '24h',
    label: 'Últimas 24 horas',
    shortLabel: '24 h',
    analyzed: 1867,
    safe: 1816,
    medium: 35,
    high: 16,
    threats: 51,
    blocked: 16,
    protectionRate: 99.1,
    avgMs: 212,
    deltas: { analyzed: 6.4, threats: -3.1, blocked: 1.0 },
    activity: {
      labels: ['00 h', '03 h', '06 h', '09 h', '12 h', '15 h', '18 h', '21 h'],
      analyzed: [142, 168, 201, 284, 326, 301, 253, 192],
      threats: [3, 4, 5, 8, 10, 9, 7, 5],
    },
  },
  '7d': {
    period: '7d',
    label: 'Últimos 7 días',
    shortLabel: '7 días',
    analyzed: 12847,
    safe: 12519,
    medium: 232,
    high: 96,
    threats: 328,
    blocked: 96,
    protectionRate: 99.3,
    avgMs: 186,
    deltas: { analyzed: 12.4, threats: 8.1, blocked: -4.2 },
    activity: {
      labels: recentDayLabels(7),
      analyzed: [1712, 1843, 1901, 1780, 1934, 1810, 1867],
      threats: [42, 38, 51, 47, 44, 55, 51],
    },
  },
  '30d': {
    period: '30d',
    label: 'Últimos 30 días',
    shortLabel: '30 días',
    analyzed: 54210,
    safe: 52826,
    medium: 982,
    high: 402,
    threats: 1384,
    blocked: 402,
    protectionRate: 99.2,
    avgMs: 195,
    deltas: { analyzed: 18.6, threats: 11.2, blocked: 2.4 },
    activity: {
      labels: [
        'Hace 5 sem',
        'Hace 4 sem',
        'Hace 3 sem',
        'Hace 2 sem',
        'Semana pasada',
        'Esta semana',
      ],
      analyzed: [8420, 8890, 9120, 8960, 9340, 9480],
      threats: [201, 214, 238, 226, 244, 261],
    },
  },
}

export const topIndicators = [
  { id: 'IND07', count: 84 },
  { id: 'IND09', count: 61 },
  { id: 'IND06', count: 53 },
  { id: 'IND05', count: 47 },
  { id: 'IND04', count: 38 },
]
