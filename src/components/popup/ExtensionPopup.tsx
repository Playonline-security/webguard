import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileWarning,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Settings2,
  ShieldCheck,
  ShieldOff,
  ShieldX,
  TriangleAlert,
  Unlock,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { PopupScenarioId } from '../../types'
import { popupScenarios } from '../../data/scenarios'
import { useAppState } from '../../context/useAppState'
import { useToast } from '../../context/useToast'
import { formatRelative } from '../../lib/format'
import { cx } from '../../lib/cx'
import { Logo } from '../brand/Logo'
import { RiskBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { IndicatorList } from '../ui/IndicatorList'
import { ScoreMeter } from '../ui/ScoreMeter'
import { Switch } from '../ui/Switch'

interface ExtensionPopupProps {
  scenarioId: PopupScenarioId
  onChangeScenario: (id: PopupScenarioId) => void
}

const scanSteps = [
  'Comprobando estructura de la URL',
  'Verificando conexión y certificado',
  'Consultando reputación del dominio',
  'Revisando formularios y contenido',
]

const scanOutcomes = ['safe', 'medium', 'high'] as const

function pickScanOutcome(): PopupScenarioId {
  return scanOutcomes[Math.floor(Math.random() * scanOutcomes.length)] ?? 'safe'
}

export function ExtensionPopup({ scenarioId, onChangeScenario }: ExtensionPopupProps) {
  const { settings, setProtectionEnabled } = useAppState()
  const { pushToast } = useToast()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [lastScan, setLastScan] = useState(() => new Date(Date.now() - 2 * 60_000))

  useEffect(() => {
    if (scenarioId !== 'scanning' || !settings.protectionEnabled) return

    const timer = window.setTimeout(() => {
      const outcome = pickScanOutcome()
      setLastScan(new Date())
      onChangeScenario(outcome)
      pushToast({
        title: 'Análisis completado',
        description: `El resultado simulado es ${popupScenarios[outcome].label.toLowerCase()}.`,
        tone: 'success',
      })
    }, 2600)

    return () => window.clearTimeout(timer)
  }, [scenarioId, settings.protectionEnabled, onChangeScenario, pushToast])

  const effectiveState: PopupScenarioId =
    !settings.protectionEnabled || scenarioId === 'disabled' ? 'disabled' : scenarioId

  const scenario = popupScenarios[scenarioId]
  const risk = scenario.risk
  const isIdle = effectiveState === 'idle'
  const isDisabled = effectiveState === 'disabled'
  const isScanningState = effectiveState === 'scanning'
  const isHigh = effectiveState === 'high'
  const isMedium = effectiveState === 'medium'
  const isSafe = effectiveState === 'safe'
  const indicatorCount = scenario.indicatorIds.length

  const handleProtectionToggle = (enabled: boolean) => {
    setProtectionEnabled(enabled)
    if (enabled) {
      onChangeScenario('scanning')
      pushToast({
        title: 'Protección activada',
        description: 'WebGuard volverá a analizar la navegación de esta pestaña.',
        tone: 'success',
      })
      return
    }

    onChangeScenario('disabled')
    pushToast({
      title: 'Protección desactivada',
      description: 'WebGuard dejará de analizar la navegación de esta pestaña.',
      tone: 'warning',
    })
  }

  const goToSafe = () => {
    onChangeScenario('safe')
    pushToast({
      title: 'Has vuelto a un sitio seguro',
      description: 'El escenario se actualizó a un dominio sin señales de riesgo.',
      tone: 'success',
    })
  }

  const statusClass = isDisabled
    ? 'is-disabled'
    : isScanningState
      ? 'is-scanning'
      : `is-${risk}`

  return (
    <section className="popup" aria-label="Popup de la extensión WebGuard">
      <header className="popup__header">
        <Link to="/" className="popup__brand" aria-label="WebGuard, abrir panel">
          <Logo size="sm" />
        </Link>
        <div className="popup__header-actions">
          <span
            className={cx(
              'popup__protect-state',
              settings.protectionEnabled ? 'is-on' : 'is-off',
            )}
          >
            <i className="status-dot" />
            {settings.protectionEnabled ? 'Activa' : 'En pausa'}
          </span>
          <Switch
            checked={settings.protectionEnabled}
            onChange={handleProtectionToggle}
            label="Activar o desactivar la protección"
          />
          <button
            type="button"
            className="popup__icon-button"
            aria-label="Abrir configuración"
            title="Configuración"
            onClick={() => navigate('/settings')}
          >
            <Settings2 size={17} aria-hidden="true" />
          </button>
        </div>
      </header>

      {!isIdle ? (
        <div className="popup__url">
          <span className={cx('popup__url-icon', isHigh || isDisabled ? 'is-warn' : 'is-ok')}>
            {scenario.url.startsWith('https://') ? (
              <LockKeyhole size={13} aria-hidden="true" />
            ) : (
              <Unlock size={13} aria-hidden="true" />
            )}
          </span>
          <span className="popup__url-copy">
            <span className="popup__url-domain">{scenario.domain}</span>
            <span className="popup__url-path">
              {scenario.url.replace(/^https?:\/\/[^/]+/, '') || '/'}
            </span>
          </span>
          <span className={cx('protocol-tag', scenario.url.startsWith('https://') ? 'is-secure' : 'is-insecure')}>
            {scenario.url.startsWith('https://') ? 'HTTPS' : 'Sin HTTPS'}
          </span>
        </div>
      ) : null}

      <div className="popup__body">
        {isIdle ? (
          <div className="popup-status popup-status--idle">
            <span className="popup-status__icon">
              <ShieldCheck size={28} aria-hidden="true" />
            </span>
            <div className="popup-status__headline">
              <div>
                <p className="popup-status__kicker">Protección activa</p>
                <h2 className="popup-status__title">Listo para proteger tu navegación</h2>
              </div>
            </div>
            <p className="popup-status__copy">{scenario.summary}</p>
            <div className="popup-checks">
              <span>
                <CheckCircle2 size={15} aria-hidden="true" /> Analiza cada sitio antes de cargarlo
              </span>
              <span>
                <CheckCircle2 size={15} aria-hidden="true" /> Advierte cuando detecta riesgo medio
              </span>
              <span>
                <CheckCircle2 size={15} aria-hidden="true" /> Bloquea amenazas de riesgo alto
              </span>
            </div>
          </div>
        ) : isDisabled ? (
          <div className="popup-status popup-status--disabled">
            <span className="popup-status__icon">
              <ShieldOff size={28} aria-hidden="true" />
            </span>
            <div>
              <p className="popup-status__kicker">Protección desactivada</p>
              <h2 className="popup-status__title">Navegas sin análisis</h2>
            </div>
            <p className="popup-status__copy">{scenario.summary}</p>
            <div className="popup-status__actions">
              <Button fullWidth onClick={() => handleProtectionToggle(true)}>
                <ShieldCheck size={16} aria-hidden="true" />
                Activar protección
              </Button>
              <Button variant="ghost" fullWidth onClick={() => navigate('/settings')}>
                Abrir configuración
                <ExternalLink size={14} aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : isScanningState ? (
          <div className="popup-scanning" aria-live="polite">
            <span className="popup-scanning__icon">
              <LoaderCircle size={30} aria-hidden="true" />
            </span>
            <div className="popup-scanning__head">
              <p className="popup-status__kicker">Análisis en curso</p>
              <h2 className="popup-status__title">Revisando este sitio</h2>
              <p className="popup-status__copy">{scenario.summary}</p>
            </div>
            <div className="scan-progress" aria-hidden="true">
              <span />
            </div>
            <ul className="scan-steps">
              {scanSteps.map((step, index) => (
                <li key={step} style={{ animationDelay: `${index * 360}ms` }}>
                  <span className="scan-steps__marker">
                    {index === 0 ? <LoaderCircle size={14} /> : <span />}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className={cx('popup-status', `popup-status--${statusClass}`)}>
              <span className="popup-status__icon">
                {isSafe ? (
                  <ShieldCheck size={28} aria-hidden="true" />
                ) : isMedium ? (
                  <TriangleAlert size={28} aria-hidden="true" />
                ) : (
                  <ShieldX size={28} aria-hidden="true" />
                )}
              </span>
              <div className="popup-status__headline">
                <div>
                  <p className="popup-status__kicker">
                    {isSafe ? 'Sitio verificado' : isMedium ? 'Revisa antes de continuar' : 'Acceso bloqueado'}
                  </p>
                  <h2 className="popup-status__title">
                    {isSafe ? 'Sitio seguro' : isMedium ? 'Precaución' : 'Riesgo alto'}
                  </h2>
                </div>
                <RiskBadge risk={risk} size="sm" />
              </div>
              <p className="popup-status__copy">{scenario.summary}</p>
              <ScoreMeter score={scenario.score} compact showZones={false} />
              {isHigh ? (
                <div className="popup-status__actions">
                  <Button fullWidth onClick={goToSafe}>
                    <ArrowLeft size={15} aria-hidden="true" />
                    Volver a un sitio seguro
                  </Button>
                  <Button variant="secondary" fullWidth onClick={() => navigate('/demo/blocked')}>
                    <FileWarning size={15} aria-hidden="true" />
                    Ver pantalla de bloqueo
                  </Button>
                </div>
              ) : null}
              {isMedium ? (
                <div className="popup-status__actions">
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => setExpanded((current) => !current)}
                    aria-expanded={expanded}
                  >
                    {expanded ? 'Ocultar indicadores' : `Ver ${indicatorCount} indicadores`}
                    <ChevronDown
                      size={15}
                      className={cx('chevron', expanded && 'is-open')}
                      aria-hidden="true"
                    />
                  </Button>
                  <Button variant="ghost" fullWidth onClick={goToSafe}>
                    <ArrowLeft size={15} aria-hidden="true" />
                    Ir a un sitio seguro
                  </Button>
                </div>
              ) : null}
              {isSafe ? (
                <div className="popup-checks">
                  <span>
                    <CheckCircle2 size={15} aria-hidden="true" /> Conexión cifrada con HTTPS
                  </span>
                  <span>
                    <CheckCircle2 size={15} aria-hidden="true" /> Dominio con buena reputación
                  </span>
                  <span>
                    <CheckCircle2 size={15} aria-hidden="true" /> Sin formularios de credenciales
                  </span>
                </div>
              ) : null}
            </div>

            {isHigh ? (
              <div className="popup-findings">
                <button
                  type="button"
                  className="popup-findings__toggle"
                  onClick={() => setExpanded((current) => !current)}
                  aria-expanded={expanded}
                >
                  <span>
                    <span className="popup-findings__count">{indicatorCount}</span>
                    indicadores detectados
                  </span>
                  <ChevronDown
                    size={16}
                    className={cx('chevron', expanded && 'is-open')}
                    aria-hidden="true"
                  />
                </button>
                {expanded ? <IndicatorList ids={scenario.indicatorIds} /> : null}
              </div>
            ) : null}

            {isMedium && expanded ? (
              <div className="popup-findings popup-findings--open">
                <IndicatorList ids={scenario.indicatorIds} />
                <p className="popup-findings__note">
                  No introduzcas datos personales ni credenciales en este sitio.
                </p>
              </div>
            ) : null}

            {isSafe ? (
              <div className="popup-summary">
                <div className="popup-summary__head">
                  <span>Resumen del análisis</span>
                  <span className="popup-summary__time">
                    {formatRelative(lastScan.toISOString())}
                  </span>
                </div>
                <p>{scenario.summary}</p>
                <button
                  type="button"
                  className="popup-summary__refresh"
                  onClick={() => onChangeScenario('scanning')}
                >
                  <RefreshCw size={13} aria-hidden="true" />
                  Analizar de nuevo
                </button>
              </div>
            ) : null}

            {isMedium || isHigh ? (
              <div className="popup-summary popup-summary--quiet">
                <div className="popup-summary__head">
                  <span>Último análisis</span>
                  <span className="popup-summary__time">
                    {formatRelative(lastScan.toISOString())}
                  </span>
                </div>
                <p>
                  {isHigh
                    ? 'El bloqueo se aplicó antes de cargar el contenido de la página.'
                    : 'Puedes revisar los indicadores o volver a una página segura.'}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>

      <footer className="popup__footer">
        <Link to="/events" className="popup__footer-link">
          <Clock3 size={16} aria-hidden="true" />
          Historial
        </Link>
        <Link to="/dashboard" className="popup__footer-link">
          <LayoutDashboard size={16} aria-hidden="true" />
          Panel
        </Link>
      </footer>
    </section>
  )
}
