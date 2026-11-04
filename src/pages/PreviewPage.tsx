import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Component,
  ExternalLink,
  FlaskConical,
  LoaderCircle,
  PanelsTopLeft,
  ShieldCheck,
  ShieldOff,
  ShieldX,
  TriangleAlert,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import type { PopupScenarioId } from '../types'
import { popupScenarios, warningScenario, blockScenario } from '../data/scenarios'
import { useAppState } from '../context/useAppState'
import { useToast } from '../context/useToast'
import { ExtensionPopup } from '../components/popup/ExtensionPopup'
import { WarningScreen } from '../components/security/WarningScreen'
import { BlockScreen } from '../components/security/BlockScreen'
import { ScaledScreen } from '../components/preview/ScaledScreen'
import { ButtonLink } from '../components/ui/Button'
import { RiskBadge, ResultBadge } from '../components/ui/Badge'
import { ScoreMeter } from '../components/ui/ScoreMeter'
import { IndicatorList } from '../components/ui/IndicatorList'
import { Switch } from '../components/ui/Switch'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Button } from '../components/ui/Button'
import { cx } from '../lib/cx'

type PreviewTab = 'popup' | 'warning' | 'blocked' | 'components'

const tabOptions: Array<{
  id: PreviewTab
  label: string
  icon: typeof PanelsTopLeft
  description: string
}> = [
  { id: 'popup', label: 'Popup', icon: PanelsTopLeft, description: 'Cinco estados de la extensión' },
  { id: 'warning', label: 'Advertencia', icon: TriangleAlert, description: 'Riesgo medio' },
  { id: 'blocked', label: 'Bloqueo', icon: ShieldX, description: 'Riesgo alto' },
  { id: 'components', label: 'Componentes', icon: Component, description: 'Estados y controles' },
]

const scenarioIcons = {
  safe: ShieldCheck,
  medium: TriangleAlert,
  high: ShieldX,
  disabled: ShieldOff,
  scanning: LoaderCircle,
} as const

const scenarioOrder: PopupScenarioId[] = ['safe', 'medium', 'high', 'disabled', 'scanning']

function isPreviewTab(value: string | null): value is PreviewTab {
  return value === 'popup' || value === 'warning' || value === 'blocked' || value === 'components'
}

function isPopupState(value: string | null): value is PopupScenarioId {
  return (
    value === 'safe' ||
    value === 'medium' ||
    value === 'high' ||
    value === 'disabled' ||
    value === 'scanning'
  )
}

export function PreviewPage() {
  const [params, setParams] = useSearchParams()
  const { setProtectionEnabled } = useAppState()
  const { pushToast } = useToast()
  const [componentToggle, setComponentToggle] = useState(true)
  const [componentSensitivity, setComponentSensitivity] = useState<'low' | 'balanced' | 'high'>(
    'balanced',
  )

  const rawTab = params.get('tab')
  const rawState = params.get('state')
  const tab: PreviewTab = isPreviewTab(rawTab) ? rawTab : 'popup'
  const popupState: PopupScenarioId = isPopupState(rawState) ? rawState : 'safe'

  const update = (nextTab: PreviewTab, nextState: PopupScenarioId = popupState) => {
    const next = new URLSearchParams(params)
    next.set('tab', nextTab)
    next.set('state', nextState)
    setParams(next, { replace: true })
  }

  const selectScenario = (id: PopupScenarioId) => {
    setProtectionEnabled(id !== 'disabled')
    update('popup', id)
  }

  const activeScenario = tab === 'warning' ? warningScenario : tab === 'blocked' ? blockScenario : null

  return (
    <div className="page-stack preview-page">
      <header className="preview-header">
        <div>
          <div className="preview-header__title-line">
            <h1>Centro de escenarios</h1>
            <span className="prototype-tag">
              <FlaskConical size={13} aria-hidden="true" />
              Herramienta de prototipo
            </span>
          </div>
          <p>
            Selecciona y revisa los estados de WebGuard sin instalar la extensión ni visitar sitios
            reales.
          </p>
        </div>
        <ButtonLink to="/" variant="secondary" size="sm">
          Volver al panel
          <ArrowRight size={15} aria-hidden="true" />
        </ButtonLink>
      </header>

      <div className="prototype-banner">
        <span className="prototype-banner__icon">
          <FlaskConical size={19} aria-hidden="true" />
        </span>
        <div>
          <strong>Este centro no forma parte de la interfaz final</strong>
          <p>
            Es una herramienta de revisión para evaluar la experiencia. Los dominios, indicadores y
            decisiones son datos simulados.
          </p>
        </div>
        <span className="prototype-banner__stamp">UI/UX review · v0.1</span>
      </div>

      <div className="preview-tabs" role="tablist" aria-label="Vistas del prototipo">
        {tabOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={tab === option.id}
            className={cx('preview-tab', tab === option.id && 'is-active')}
            onClick={() => update(option.id)}
          >
            <option.icon size={17} aria-hidden="true" />
            <span className="preview-tab__copy">
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </span>
          </button>
        ))}
      </div>

      {tab === 'popup' ? (
        <div className="preview-layout">
          <aside className="scenario-panel" aria-label="Estados del popup">
            <div className="scenario-panel__head">
              <h2>Estados del popup</h2>
              <p>Selecciona el escenario que quieres revisar.</p>
            </div>
            <div className="scenario-list">
              {scenarioOrder.map((id) => {
                const scenario = popupScenarios[id]
                const Icon = scenarioIcons[id]
                const risk =
                  id === 'disabled' || id === 'scanning' ? 'neutral' : scenario.risk
                return (
                  <button
                    key={id}
                    type="button"
                    className={cx(
                      'scenario-option',
                      popupState === id && 'is-active',
                      `is-${risk}`,
                    )}
                    aria-pressed={popupState === id}
                    onClick={() => selectScenario(id)}
                  >
                    <span className="scenario-option__icon">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span className="scenario-option__copy">
                      <strong>{scenario.label}</strong>
                      <span>{scenario.description}</span>
                    </span>
                    <span className="scenario-option__chevron" aria-hidden="true">›</span>
                  </button>
                )
              })}
            </div>

            <div className="scenario-panel__note">
              <strong>Popup realista</strong>
              <p>
                El tamaño representa un popup de extensión de Chrome. Los accesos del pie abren el
                panel y la configuración del prototipo.
              </p>
            </div>
          </aside>

          <section className="preview-canvas" aria-label="Vista previa del popup">
            <div className="preview-canvas__head">
              <div>
                <span className="preview-canvas__eyebrow">Extensión Chrome</span>
                <h2>{popupScenarios[popupState].label}</h2>
              </div>
              <span className="size-badge">384 × 600 px</span>
            </div>
            <div className="popup-stage">
              <ExtensionPopup scenarioId={popupState} onChangeScenario={selectScenario} />
            </div>
            <p className="preview-canvas__note">
              Los controles internos del popup están activos. «Configuración» y «Panel» abren las
              secciones reales del prototipo.
            </p>
          </section>
        </div>
      ) : null}

      {tab === 'warning' || tab === 'blocked' ? (
        <div className="preview-layout preview-layout--screen">
          <aside className="scenario-panel">
            <div className="scenario-panel__head">
              <h2>{tab === 'warning' ? 'Pantalla de advertencia' : 'Pantalla de bloqueo'}</h2>
              <p>
                {tab === 'warning'
                  ? 'Riesgo medio: el usuario puede revisar o continuar.'
                  : 'Riesgo alto: el acceso se detiene sin opción de continuar.'}
              </p>
            </div>

            {activeScenario ? (
              <>
                <div className="scenario-summary">
                  <div className="scenario-summary__badges">
                    <RiskBadge risk={activeScenario.risk} />
                    <ResultBadge result={tab === 'warning' ? 'warned' : 'blocked'} />
                  </div>
                  <span className="mono-label">{activeScenario.domain}</span>
                  <p className="mono-url">{activeScenario.url}</p>
                  <ScoreMeter score={activeScenario.score} compact showZones={false} />
                </div>

                <div className="scenario-summary__section">
                  <h3>Indicadores del escenario</h3>
                  <IndicatorList ids={activeScenario.indicatorIds} />
                </div>

                <div className="scenario-summary__section">
                  <h3>Qué incluye</h3>
                  <ul className="preview-checklist">
                    <li><CheckCircle2 size={14} /> Identidad y estado de riesgo</li>
                    <li><CheckCircle2 size={14} /> Dominio, motivos e indicadores</li>
                    <li><CheckCircle2 size={14} /> Acciones y confirmación</li>
                    <li><CheckCircle2 size={14} /> Diseño adaptable</li>
                  </ul>
                </div>
              </>
            ) : null}

            <ButtonLink
              to={tab === 'warning' ? '/demo/warning' : '/demo/blocked'}
              variant="primary"
              size="sm"
              fullWidth
            >
              <ExternalLink size={15} aria-hidden="true" />
              Abrir a tamaño completo
            </ButtonLink>
            <p className="scenario-panel__footnote">
              La vista previa muestra el primer viewport. Ábrela a tamaño completo para recorrer
              toda la pantalla.
            </p>
          </aside>

          <section className="preview-canvas preview-canvas--screen" aria-label="Vista previa de la pantalla">
            <div className="preview-canvas__head">
              <div>
                <span className="preview-canvas__eyebrow">Vista escalada</span>
                <h2>{tab === 'warning' ? 'Advertencia de riesgo medio' : 'Bloqueo de riesgo alto'}</h2>
              </div>
              <span className="size-badge">Vista de 1180 px</span>
            </div>
            <div className="screen-stage">
              <ScaledScreen baseWidth={1180} baseHeight={860}>
                {tab === 'warning' ? <WarningScreen /> : <BlockScreen />}
              </ScaledScreen>
            </div>
            <p className="preview-canvas__note">
              La pantalla se renderiza con sus propios estilos para comprobar jerarquía, densidad y
              acciones. Los enlaces funcionan dentro del prototipo.
            </p>
          </section>
        </div>
      ) : null}

      {tab === 'components' ? (
        <div className="component-gallery">
          <section className="component-section">
            <div className="component-section__head">
              <h2>Estados de riesgo</h2>
              <p>Color, icono, etiqueta y texto trabajan juntos. Ningún estado depende solo del color.</p>
            </div>
            <div className="state-gallery">
              <div className="state-sample state-sample--safe">
                <span className="state-sample__icon"><ShieldCheck size={24} /></span>
                <div>
                  <RiskBadge risk="safe" />
                  <h3>Sitio seguro</h3>
                  <p>Sin señales relevantes. La navegación continúa con vigilancia.</p>
                </div>
              </div>
              <div className="state-sample state-sample--medium">
                <span className="state-sample__icon"><TriangleAlert size={24} /></span>
                <div>
                  <RiskBadge risk="medium" />
                  <h3>Riesgo medio</h3>
                  <p>Se muestra una advertencia antes de permitir el acceso.</p>
                </div>
              </div>
              <div className="state-sample state-sample--high">
                <span className="state-sample__icon"><ShieldX size={24} /></span>
                <div>
                  <RiskBadge risk="high" />
                  <h3>Riesgo alto</h3>
                  <p>El sitio se bloquea antes de cargar contenido.</p>
                </div>
              </div>
            </div>
          </section>

          <div className="component-grid">
            <section className="component-card">
              <div className="component-section__head">
                <h2>Puntuación de riesgo</h2>
                <p>La posición y el nivel textual comunican el resultado.</p>
              </div>
              <div className="score-stack">
                <ScoreMeter score={12} label="Riesgo bajo" />
                <ScoreMeter score={63} label="Riesgo medio" />
                <ScoreMeter score={94} label="Riesgo alto" />
              </div>
            </section>

            <section className="component-card">
              <div className="component-section__head">
                <h2>Indicadores</h2>
                <p>Identificador, nombre y peso visible en un mismo componente.</p>
              </div>
              <IndicatorList ids={warningScenario.indicatorIds} variant="full" />
            </section>

            <section className="component-card">
              <div className="component-section__head">
                <h2>Botones y etiquetas</h2>
                <p>Muestras visuales de las variantes usadas en el producto.</p>
              </div>
              <div className="button-samples" aria-hidden="true">
                <span className="btn btn--primary btn--md">Acción principal</span>
                <span className="btn btn--secondary btn--md">Acción secundaria</span>
                <span className="btn btn--ghost btn--md">Acción terciaria</span>
                <span className="btn btn--danger btn--md">Acción de riesgo</span>
                <span className="btn btn--primary btn--md" aria-disabled="true">Deshabilitado</span>
              </div>
              <div className="badge-samples">
                <RiskBadge risk="safe" />
                <RiskBadge risk="medium" />
                <RiskBadge risk="high" />
                <ResultBadge result="allowed" />
                <ResultBadge result="warned" />
                <ResultBadge result="blocked" />
              </div>
            </section>

            <section className="component-card">
              <div className="component-section__head">
                <h2>Controles interactivos</h2>
                <p>Prueba los estados de foco, selección y notificación.</p>
              </div>
              <div className="control-demo">
                <div className="control-demo__row">
                  <span>Control de muestra</span>
                  <Switch
                    checked={componentToggle}
                    onChange={setComponentToggle}
                    label="Control de muestra"
                  />
                </div>
                <SegmentedControl
                  label="Sensibilidad de muestra"
                  size="sm"
                  value={componentSensitivity}
                  onChange={setComponentSensitivity}
                  options={[
                    { value: 'low', label: 'Baja' },
                    { value: 'balanced', label: 'Equilibrada' },
                    { value: 'high', label: 'Alta' },
                  ]}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    pushToast({
                      title: 'Componente de demostración',
                      description: 'Así se ven las notificaciones del prototipo.',
                      tone: 'info',
                    })
                  }
                >
                  Mostrar notificación
                </Button>
              </div>
            </section>
          </div>

          <section className="component-card component-card--wide">
            <div className="component-section__head">
              <h2>Enlaces a las pantallas</h2>
              <p>Accede a los escenarios completos para revisar la experiencia de extremo a extremo.</p>
            </div>
            <div className="component-links">
              <Link to="/demo/warning" className="component-link">
                <TriangleAlert size={18} aria-hidden="true" />
                <span>
                  <strong>Advertencia de riesgo medio</strong>
                  <span>Revisa motivos, indicadores y la acción de continuar.</span>
                </span>
                <ExternalLink size={15} aria-hidden="true" />
              </Link>
              <Link to="/demo/blocked" className="component-link">
                <ShieldX size={18} aria-hidden="true" />
                <span>
                  <strong>Bloqueo de riesgo alto</strong>
                  <span>Comprueba la jerarquía de una pantalla sin opción de continuar.</span>
                </span>
                <ExternalLink size={15} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
