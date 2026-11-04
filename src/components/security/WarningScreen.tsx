import { useState } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  LockKeyhole,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { warningScenario } from '../../data/scenarios'
import { useToast } from '../../context/useToast'
import { SecurityFooter, SecurityHeader } from './SecurityChrome'
import { Button } from '../ui/Button'
import { IndicatorList } from '../ui/IndicatorList'
import { Modal } from '../ui/Modal'
import { RiskBadge } from '../ui/Badge'

export function WarningScreen() {
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const goSafe = () => {
    pushToast({
      title: 'Has vuelto a un sitio seguro',
      description: 'No se cargó el sitio con riesgo medio.',
      tone: 'success',
    })
    navigate('/?tab=popup&state=safe')
  }

  const continueAnyway = () => {
    setDialogOpen(false)
    setAccepted(false)
    pushToast({
      title: 'Riesgo aceptado',
      description:
        'En la extensión real, el sitio se abriría bajo tu responsabilidad con protección reducida.',
      tone: 'warning',
    })
    navigate('/?tab=popup&state=medium')
  }

  return (
    <div className="security-page security-page--warning">
      <SecurityHeader variant="warning" />

      <main className="security-main" id="main-content">
        <div className="security-banner security-banner--warning">
          <span className="security-banner__icon">
            <TriangleAlert size={18} aria-hidden="true" />
          </span>
          <span className="security-banner__title">Advertencia de seguridad</span>
          <RiskBadge risk="medium" size="sm" />
        </div>

        <section className="security-hero">
          <div className="security-hero__main">
            <p className="security-kicker">Sitio con riesgo medio</p>
            <h1 className="security-title">Este sitio puede poner en riesgo tus datos</h1>
            <p className="security-lede">
              WebGuard encontró señales que imitan el acceso de una entidad financiera. Aún no
              sabemos si el sitio es legítimo, así que conviene revisar antes de continuar.
            </p>

            <div className="site-plate">
              <span className="site-plate__icon">
                <LockKeyhole size={16} aria-hidden="true" />
              </span>
              <span className="site-plate__copy">
                <span className="site-plate__label">Dominio evaluado</span>
                <strong className="site-plate__domain">{warningScenario.domain}</strong>
                <span className="site-plate__url">{warningScenario.url}</span>
              </span>
              <span className="protocol-tag is-secure">HTTPS</span>
            </div>
          </div>

          <aside className="security-score" aria-label="Puntuación de riesgo">
            <span className="security-score__label">Puntuación de riesgo</span>
            <div className="security-score__value">
              <strong>{warningScenario.score}</strong>
              <span>/100</span>
            </div>
            <div className="security-score__gauge" aria-hidden="true">
              <span style={{ width: `${warningScenario.score}%` }} />
            </div>
            <div className="security-score__meta">
              <RiskBadge risk="medium" size="sm" />
              <span>Revisión recomendada</span>
            </div>
            <p className="security-score__note">
              Por encima de 30 se muestra una advertencia. Por encima de 70, el sitio se bloquea.
            </p>
          </aside>
        </section>

        <div className="security-grid">
          <section className="security-card">
            <div className="security-card__heading">
              <h2>Por qué se muestra esta advertencia</h2>
              <span className="security-card__index">4 señales</span>
            </div>
            <ul className="reason-list">
              {warningScenario.reasons.map((reason) => (
                <li key={reason}>
                  <span className="reason-list__marker" aria-hidden="true">
                    <ChevronRight size={14} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
            <div className="security-callout">
              <ShieldCheck size={17} aria-hidden="true" />
              <p>{warningScenario.recommendation}</p>
            </div>
          </section>

          <section className="security-card">
            <div className="security-card__heading">
              <h2>Indicadores detectados</h2>
              <span className="security-card__index">{warningScenario.indicatorIds.length} reglas</span>
            </div>
            <IndicatorList ids={warningScenario.indicatorIds} variant="full" />
            <Link to="/rules?highlight=IND07" className="text-link security-card__link">
              Consultar las reglas aplicadas
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </section>
        </div>

        <section className="security-outcome">
          <div className="security-outcome__copy">
            <h2>¿Quieres continuar de todos modos?</h2>
            <p>
              Si conoces este sitio y confías en él, puedes continuar bajo tu responsabilidad. Si
              tienes dudas, vuelve a una página segura y accede escribiendo la dirección oficial.
            </p>
          </div>
          <div className="security-actions">
            <Button size="lg" onClick={goSafe}>
              <ArrowLeft size={17} aria-hidden="true" />
              Volver a un sitio seguro
            </Button>
            <Button variant="ghost" size="lg" onClick={() => setDialogOpen(true)}>
              Continuar de todos modos
            </Button>
          </div>
        </section>

        <section className="security-info">
          <div>
            <h2>Qué hace WebGuard</h2>
            <p>
              Analiza la estructura de la URL, la conexión y la reputación del dominio antes de que
              introduzcas datos. Esta evaluación es parte del prototipo y no representa una
              detección real.
            </p>
          </div>
          <div>
            <h2>Qué puedes hacer ahora</h2>
            <p>
              Cierra la pestaña si no esperabas este acceso. Para entrar en tu banco, escribe su
              dirección oficial en una pestaña nueva y comprueba que el dominio coincide.
            </p>
          </div>
        </section>
      </main>

      <SecurityFooter />

      <Modal
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setAccepted(false)
        }}
        title="Continuar a este sitio"
        description="El sitio no ha sido verificado. En la extensión real, continuar reduciría el nivel de protección de esta pestaña."
        tone="danger"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDialogOpen(false)
                setAccepted(false)
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" disabled={!accepted} onClick={continueAnyway}>
              Continuar al sitio
            </Button>
          </>
        }
      >
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>
            Entiendo que WebGuard no podrá comprobar este sitio y que continúo bajo mi
            responsabilidad.
          </span>
        </label>
        <p className="modal-note">
          Dominio: <span className="mono-label">{warningScenario.domain}</span>
        </p>
      </Modal>
    </div>
  )
}
