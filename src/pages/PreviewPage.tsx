import { useState } from 'react'
import {
  ArrowRight,
  Component,
  Copy,
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
import { popupScenarios, warningScenario } from '../data/scenarios'
import { useAppState } from '../context/useAppState'
import { useToast } from '../context/useToast'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { copyText } from '../lib/clipboard'
import { ExtensionPopup } from '../components/popup/ExtensionPopup'
import { ScenarioTopbar } from '../components/layout/ScenarioTopbar'
import { Button, ButtonLink } from '../components/ui/Button'
import { RiskBadge, ResultBadge } from '../components/ui/Badge'
import { ScoreMeter } from '../components/ui/ScoreMeter'
import { IndicatorList } from '../components/ui/IndicatorList'
import { Switch } from '../components/ui/Switch'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { cx } from '../lib/cx'

type PreviewView = 'popup' | 'components'

const guidedSteps = [
  {
    id: 'popup',
    label: 'Popup de la extensión',
    description: 'Revisa los cinco estados del panel de WebGuard.',
    meta: 'Paso actual',
    icon: PanelsTopLeft,
  },
  {
    id: 'warning',
    label: 'Advertencia de riesgo medio',
    description: 'El usuario puede revisar los motivos o continuar bajo su responsabilidad.',
    meta: 'Riesgo 63/100',
    icon: TriangleAlert,
    to: '/demo/warning',
  },
  {
    id: 'blocked',
    label: 'Bloqueo de riesgo alto',
    description: 'El acceso se detiene antes de cargar el contenido del sitio.',
    meta: 'Riesgo 94/100',
    icon: ShieldX,
    to: '/demo/blocked',
  },
] as const

const scenarioIcons = {
  safe: ShieldCheck,
  medium: TriangleAlert,
  high: ShieldX,
  disabled: ShieldOff,
  scanning: LoaderCircle,
} as const

const scenarioOrder: PopupScenarioId[] = ['safe', 'medium', 'high', 'disabled', 'scanning']

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
  const rawState = params.get('state')
  const showComponents = params.get('tab') === 'components'
  const popupState: PopupScenarioId = isPopupState(rawState) ? rawState : 'safe'

  useDocumentTitle(
    showComponents ? 'WebGuard · Biblioteca de componentes' : 'WebGuard · Centro de escenarios',
  )

  const update = (nextView: PreviewView, nextState: PopupScenarioId = popupState) => {
    const next = new URLSearchParams()
    next.set('tab', nextView)
    next.set('state', nextState)
    setParams(next, { replace: true })
  }

  const selectScenario = (id: PopupScenarioId) => {
    setProtectionEnabled(id !== 'disabled')
    update('popup', id)
  }

  const copyScenarioLink = async () => {
    const copied = await copyText(window.location.href)
    pushToast({
      title: copied ? 'Enlace copiado' : 'No se pudo copiar',
      description: copied
        ? 'La dirección de este escenario está en el portapapeles.'
        : 'Selecciona la dirección del navegador para copiarla manualmente.',
      tone: copied ? 'success' : 'warning',
    })
  }

  const popupLayout = (
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
            const risk = id === 'disabled' || id === 'scanning' ? 'neutral' : scenario.risk
            return (
              <button
                key={id}
                type="button"
                className={cx('scenario-option', popupState === id && 'is-active', `is-${risk}`)}
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
                <span className="scenario-option__chevron" aria-hidden="true">
                  ›
                </span>
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
        <div className="preview-canvas__flow">
          <span>Paso 1 de 3</span>
          <ButtonLink
            to="/demo/warning"
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            size="sm"
          >
            Siguiente: Advertencia
            <ArrowRight size={15} aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>
    </div>
  )

  const componentsGallery = (
    <div className="component-gallery" id="panel-components">
      <div className="component-gallery__head">
        <div>
          <h2>Biblioteca de componentes</h2>
          <p>Estados, controles y patrones visuales usados en el prototipo.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => update('popup')}>
          <ArrowRight size={15} aria-hidden="true" />
          Volver al flujo
        </Button>
      </div>

      <section className="component-section">
        <div className="component-section__head">
          <h2>Estados de riesgo</h2>
          <p>Color, icono, etiqueta y texto trabajan juntos. Ningún estado depende solo del color.</p>
        </div>
        <div className="state-gallery">
          <div className="state-sample state-sample--safe">
            <span className="state-sample__icon">
              <ShieldCheck size={24} />
            </span>
            <div>
              <RiskBadge risk="safe" />
              <h3>Sitio seguro</h3>
              <p>Sin señales relevantes. La navegación continúa con vigilancia.</p>
            </div>
          </div>
          <div className="state-sample state-sample--medium">
            <span className="state-sample__icon">
              <TriangleAlert size={24} />
            </span>
            <div>
              <RiskBadge risk="medium" />
              <h3>Riesgo medio</h3>
              <p>Se muestra una advertencia antes de permitir el acceso.</p>
            </div>
          </div>
          <div className="state-sample state-sample--high">
            <span className="state-sample__icon">
              <ShieldX size={24} />
            </span>
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
            <span className="btn btn--primary btn--md" aria-disabled="true">
              Deshabilitado
            </span>
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
          <Link to="/demo/warning" target="_blank" rel="noreferrer" className="component-link">
            <TriangleAlert size={18} aria-hidden="true" />
            <span>
              <strong>Advertencia de riesgo medio</strong>
              <span>Revisa motivos, indicadores y la acción de continuar.</span>
            </span>
            <ExternalLink size={15} aria-hidden="true" />
          </Link>
          <Link to="/demo/blocked" target="_blank" rel="noreferrer" className="component-link">
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
  )

  const guidedLayout = (
    <>
      <section className="guided-flow" aria-labelledby="guided-flow-title">
        <div className="guided-flow__head">
          <span className="preview-canvas__eyebrow">Recorrido recomendado</span>
          <h2 id="guided-flow-title">Del aviso al bloqueo</h2>
          <p>
            El popup se revisa aquí. Advertencia y bloqueo se abren en pestaña nueva para conservar
            este centro de escenarios.
          </p>
        </div>
        <ol className="scenario-flow">
          {guidedSteps.map((step, index) => {
            const Icon = step.icon
            const content = (
              <>
                <span className="scenario-flow__index">{index + 1}</span>
                <span className="scenario-flow__icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="scenario-flow__copy">
                  <strong>{step.label}</strong>
                  <span>{step.description}</span>
                </span>
                <span className="scenario-flow__meta">
                  {step.meta}
                  {'to' in step ? <ExternalLink size={14} aria-hidden="true" /> : null}
                </span>
              </>
            )

            return (
              <li key={step.id} className={cx('scenario-flow__item', step.id === 'popup' && 'is-active')}>
                {'to' in step ? (
                  <Link to={step.to} target="_blank" rel="noreferrer" className="scenario-flow__link">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            )
          })}
        </ol>
      </section>

      {popupLayout}

      <div className="preview-secondary-link">
        <Button variant="quiet" size="sm" onClick={() => update('components')}>
          <Component size={15} aria-hidden="true" />
          Explorar biblioteca de componentes
          <ArrowRight size={15} aria-hidden="true" />
        </Button>
      </div>
    </>
  )

  return (
    <div className="scenario-home">
      <ScenarioTopbar />
      <main className="app-content" id="main-content">
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
                Revisa cómo se ven el popup, la advertencia y el bloqueo de WebGuard en el orden en
                que aparecen durante la navegación.
              </p>
            </div>
            <div className="preview-header__actions">
              <Button variant="secondary" size="sm" onClick={copyScenarioLink}>
                <Copy size={15} aria-hidden="true" />
                Copiar enlace
              </Button>
            </div>
          </header>

          <div className="prototype-banner">
            <span className="prototype-banner__icon">
              <FlaskConical size={19} aria-hidden="true" />
            </span>
            <div>
              <strong>Este centro no forma parte de la interfaz final</strong>
              <p>
                Es una herramienta de revisión para evaluar la experiencia. Los dominios,
                indicadores y decisiones son datos simulados.
              </p>
            </div>
            <span className="prototype-banner__stamp">UI/UX review · v0.1</span>
          </div>

          {showComponents ? componentsGallery : guidedLayout}
        </div>
      </main>
    </div>
  )
}
