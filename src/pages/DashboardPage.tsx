import { useState } from 'react'
import { Activity, Gauge, Globe2, ShieldX, TriangleAlert } from 'lucide-react'
import { useAppState } from '../context/useAppState'
import { useToast } from '../context/useToast'
import { statsByPeriod } from '../data/stats'
import type { Period } from '../types'
import { formatDelta, formatNumber } from '../lib/format'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { PageHeader } from '../components/layout/PageHeader'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { ProtectionBand } from '../components/dashboard/ProtectionBand'
import { ActivityChart } from '../components/dashboard/ActivityChart'
import { RiskDistribution } from '../components/dashboard/RiskDistribution'
import { RecentEvents } from '../components/dashboard/RecentEvents'
import { TopIndicators } from '../components/dashboard/TopIndicators'
import { cx } from '../lib/cx'

const periodOptions: Array<{ value: Period; label: string }> = [
  { value: '24h', label: '24 h' },
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
]

export function DashboardPage() {
  useDocumentTitle('WebGuard · Resumen de protección')
  const { settings, setProtectionEnabled } = useAppState()
  const { pushToast } = useToast()
  const [period, setPeriod] = useState<Period>('7d')
  const [pauseOpen, setPauseOpen] = useState(false)
  const stats = statsByPeriod[period]

  const handleProtectionToggle = () => {
    if (settings.protectionEnabled) {
      setPauseOpen(true)
      return
    }
    setProtectionEnabled(true)
    pushToast({
      title: 'Protección activada',
      description: 'WebGuard volverá a analizar la navegación en este navegador.',
      tone: 'success',
    })
  }

  const confirmPause = () => {
    setPauseOpen(false)
    setProtectionEnabled(false)
    pushToast({
      title: 'Protección pausada',
      description: 'No se analizarán páginas nuevas en este prototipo.',
      tone: 'warning',
    })
  }

  const kpis = [
    {
      label: 'Sitios analizados',
      value: formatNumber(stats.analyzed),
      delta: stats.deltas.analyzed,
      icon: Globe2,
      caption: stats.label,
    },
    {
      label: 'Amenazas detectadas',
      value: formatNumber(stats.threats),
      delta: stats.deltas.threats,
      icon: TriangleAlert,
      caption: 'Riesgo medio y alto',
    },
    {
      label: 'Sitios bloqueados',
      value: formatNumber(stats.blocked),
      delta: stats.deltas.blocked,
      icon: ShieldX,
      caption: 'Riesgo alto detenido',
    },
    {
      label: 'Cobertura de protección',
      value: `${stats.protectionRate.toLocaleString('es-CL', { minimumFractionDigits: 1 })} %`,
      delta: null,
      icon: Gauge,
      caption: 'Páginas con análisis completo',
    },
  ]

  return (
    <div className="page-stack">
      <PageHeader
        title="Resumen de protección"
        description="Actividad de WebGuard en este navegador."
        actions={
          <div className="page-header__control">
            <span className="page-header__control-label">Periodo</span>
            <SegmentedControl
              label="Periodo de las estadísticas"
              options={periodOptions}
              value={period}
              onChange={setPeriod}
            />
          </div>
        }
      />

      <ProtectionBand
        stats={stats}
        enabled={settings.protectionEnabled}
        onToggle={handleProtectionToggle}
      />

      <section className="stat-strip" aria-label="Indicadores principales">
        {kpis.map((kpi) => (
          <article className="stat" key={kpi.label}>
            <div className="stat__top">
              <span className="stat__icon">
                <kpi.icon size={18} aria-hidden="true" />
              </span>
              {kpi.delta !== null ? (
                <span className={cx('stat__delta', kpi.delta >= 0 ? 'is-up' : 'is-down')}>
                  {formatDelta(kpi.delta)}
                </span>
              ) : (
                <span className="stat__delta stat__delta--static">Estable</span>
              )}
            </div>
            <p className="stat__label">{kpi.label}</p>
            <p className="stat__value">{kpi.value}</p>
            <p className="stat__caption">{kpi.caption}</p>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="panel panel--chart">
          <ActivityChart stats={stats} />
        </section>
        <section className="panel">
          <RiskDistribution stats={stats} />
        </section>
        <section className="panel panel--events">
          <RecentEvents />
        </section>
        <section className="panel">
          <TopIndicators />
        </section>
      </div>

      <div className="page-note">
        <Activity size={15} aria-hidden="true" />
        <span>
          Todos los datos de este panel son simulados para revisar la experiencia del prototipo.
        </span>
      </div>

      <Modal
        open={pauseOpen}
        onClose={() => setPauseOpen(false)}
        title="Pausar la protección"
        description="WebGuard dejará de analizar páginas nuevas hasta que vuelvas a activarla."
        tone="danger"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPauseOpen(false)}>
              Mantener activa
            </Button>
            <Button variant="danger" onClick={confirmPause}>
              Pausar protección
            </Button>
          </>
        }
      >
        <div className="pause-summary">
          <span className="pause-summary__icon">
            <ShieldX size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="pause-summary__title">La navegación continuará sin advertencias</p>
            <p className="pause-summary__copy">
              Los eventos anteriores se conservan. Esta acción solo modifica el estado simulado del
              prototipo y puede revertirse desde el panel o la configuración.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
