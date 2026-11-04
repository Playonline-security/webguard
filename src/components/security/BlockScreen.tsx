import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ClipboardCheck,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { blockScenario } from '../../data/scenarios'
import { useToast } from '../../context/useToast'
import { riskLabels } from '../../lib/risk'
import { SecurityFooter, SecurityHeader } from './SecurityChrome'
import { Button, ButtonLink } from '../ui/Button'
import { IndicatorList } from '../ui/IndicatorList'
import { Modal } from '../ui/Modal'
import { RiskBadge } from '../ui/Badge'

interface ClipboardLike {
  writeText: (value: string) => Promise<void>
}

export function BlockScreen() {
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [manualReport, setManualReport] = useState('')
  const [reportOpen, setReportOpen] = useState(false)

  const goSafe = () => {
    pushToast({
      title: 'Has vuelto a un sitio seguro',
      description: 'El sitio bloqueado no se cargó.',
      tone: 'success',
    })
    navigate('/preview?tab=popup&state=safe')
  }

  const copyReport = async () => {
    const report = [
      'Informe de bloqueo de WebGuard (simulado)',
      `Dominio: ${blockScenario.domain}`,
      `URL: ${blockScenario.url}`,
      `Riesgo: ${riskLabels.high} (${blockScenario.score}/100)`,
      `Indicadores: ${blockScenario.indicatorIds.join(', ')}`,
      '',
      'Este informe pertenece a un prototipo visual. No hubo un bloqueo real.',
    ].join('\n')

    try {
      let copied = false
      const field = document.createElement('textarea')
      field.value = report
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.focus()
      field.select()
      try {
        copied = document.execCommand('copy')
      } catch {
        copied = false
      }
      document.body.removeChild(field)

      const clipboard = (navigator as Navigator & { clipboard?: ClipboardLike }).clipboard
      if (!copied && clipboard) {
        try {
          copied = await Promise.race([
            clipboard.writeText(report).then(() => true),
            new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), 800)),
          ])
        } catch {
          copied = false
        }
      }
      if (!copied) throw new Error('Copia no disponible')
      pushToast({
        title: 'Informe copiado',
        description: 'El informe simulado se copió al portapapeles.',
        tone: 'success',
      })
    } catch {
      setManualReport(report)
      setReportOpen(true)
      pushToast({
        title: 'Copia manual disponible',
        description: 'El portapapeles está restringido. El informe se muestra para copiarlo a mano.',
        tone: 'warning',
      })
    }
  }

  return (
    <div className="security-page security-page--blocked">
      <div className="block-strip">
        <ShieldX size={15} aria-hidden="true" />
        <span>Acceso bloqueado por WebGuard</span>
      </div>

      <SecurityHeader variant="blocked" />

      <main className="security-main security-main--blocked">
        <section className="security-hero security-hero--blocked">
          <div className="security-hero__main">
            <span className="security-block-icon">
              <ShieldX size={30} aria-hidden="true" />
            </span>
            <p className="security-kicker security-kicker--danger">Riesgo alto · 94 de 100</p>
            <h1 className="security-title">Este sitio fue bloqueado</h1>
            <p className="security-lede">
              WebGuard detuvo la carga antes de que pudieras introducir datos. La página combina
              varios indicadores críticos y no ofrece garantías suficientes para continuar.
            </p>

            <div className="site-plate site-plate--blocked">
              <span className="site-plate__icon">
                <LockKeyhole size={16} aria-hidden="true" />
              </span>
              <span className="site-plate__copy">
                <span className="site-plate__label">Sitio bloqueado</span>
                <strong className="site-plate__domain">{blockScenario.domain}</strong>
                <span className="site-plate__url">{blockScenario.url}</span>
              </span>
              <span className="protocol-tag is-insecure">Sin HTTPS</span>
            </div>

            <div className="security-block-actions">
              <Button size="lg" onClick={goSafe}>
                <ArrowLeft size={17} aria-hidden="true" />
                Volver a un sitio seguro
              </Button>
              <Button variant="secondary" size="lg" onClick={copyReport}>
                <ClipboardCheck size={16} aria-hidden="true" />
                Copiar informe
              </Button>
            </div>
          </div>

          <aside className="security-score security-score--blocked" aria-label="Puntuación de riesgo">
            <span className="security-score__label">Nivel de riesgo</span>
            <div className="security-score__value">
              <strong>94</strong>
              <span>/100</span>
            </div>
            <div className="security-score__gauge security-score__gauge--danger" aria-hidden="true">
              <span style={{ width: '94%' }} />
            </div>
            <RiskBadge risk="high" />
            <p className="security-score__note">
              El contenido no se cargó. Esta decisión pertenece a un escenario simulado del
              prototipo.
            </p>
          </aside>
        </section>

        <div className="security-grid">
          <section className="security-card security-card--danger">
            <div className="security-card__heading">
              <h2>Por qué se bloqueó</h2>
              <span className="security-card__index">4 motivos</span>
            </div>
            <ul className="reason-list reason-list--danger">
              {blockScenario.reasons.map((reason) => (
                <li key={reason}>
                  <span className="reason-list__marker" aria-hidden="true">
                    <ShieldAlert size={14} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
            <div className="security-callout security-callout--danger">
              <ShieldCheck size={17} aria-hidden="true" />
              <p>{blockScenario.recommendation}</p>
            </div>
          </section>

          <section className="security-card">
            <div className="security-card__heading">
              <h2>Indicadores que activaron el bloqueo</h2>
              <span className="security-card__index">{blockScenario.indicatorIds.length} reglas</span>
            </div>
            <IndicatorList ids={blockScenario.indicatorIds} variant="full" />
            <Link to="/rules?highlight=IND04" className="text-link security-card__link">
              Consultar las reglas aplicadas
              <ChevronRight size={14} aria-hidden="true" />
            </Link>
          </section>
        </div>

        <section className="security-info security-info--blocked">
          <div>
            <h2>Qué ocurrió</h2>
            <p>
              La URL usaba una dirección IP directa, no utilizaba HTTPS e imitaba un formulario de
              Office 365. Cada señal suma puntos; al superar el umbral de riesgo alto, WebGuard
              bloquea la carga.
            </p>
          </div>
          <div>
            <h2>Qué puedes hacer</h2>
            <p>
              No vuelvas a introducir tus credenciales en esta dirección. Si necesitas acceder al
              servicio, hazlo desde su web oficial o contacta con tu equipo de TI.
            </p>
          </div>
          <div>
            <h2>Si crees que es un error</h2>
            <p>
              En la versión final podrás solicitar una revisión desde el panel. En este prototipo no
              se envían solicitudes ni se desbloquean sitios.
            </p>
          </div>
        </section>

        <div className="security-verification">
          <Check size={16} aria-hidden="true" />
          <span>El bloqueo se aplicó antes de mostrar el contenido del sitio.</span>
          <ButtonLink to="/demo/warning" variant="quiet" size="sm">
            Ver cómo se ve una advertencia media
          </ButtonLink>
        </div>
      </main>

      <SecurityFooter />

      <Modal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Informe de bloqueo simulado"
        description="El navegador no permitió escribir en el portapapeles. Selecciona el texto y cópialo manualmente."
        footer={
          <Button variant="secondary" onClick={() => setReportOpen(false)}>
            Cerrar
          </Button>
        }
      >
        <textarea
          className="report-preview"
          value={manualReport}
          rows={11}
          readOnly
          aria-label="Contenido del informe simulado"
        />
      </Modal>
    </div>
  )
}
