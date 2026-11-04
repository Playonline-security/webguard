import { useState } from 'react'
import {
  BarChart3,
  Bell,
  CheckCircle2,
  FlaskConical,
  Globe2,
  LockKeyhole,
  MonitorSmartphone,
  RotateCcw,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppState } from '../context/useAppState'
import { useToast } from '../context/useToast'
import type { AppSettings } from '../types'
import { PageHeader } from '../components/layout/PageHeader'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Switch } from '../components/ui/Switch'
import { Button, ButtonLink } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { SettingRow } from '../components/settings/SettingRow'
import { DomainListEditor } from '../components/settings/DomainListEditor'
import { cx } from '../lib/cx'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const sensitivityCopy: Record<AppSettings['sensitivity'], string> = {
  low: 'Solo se advierte ante señales críticas. Menos interrupciones, menor cobertura.',
  balanced:
    'Equilibrio entre protección y fricción. Es el nivel recomendado para la mayoría de equipos.',
  high: 'Se muestran advertencias ante señales más débiles. Mayor protección y más interrupciones.',
}

const sensitivityLabel: Record<AppSettings['sensitivity'], string> = {
  low: 'Baja',
  balanced: 'Equilibrada',
  high: 'Alta',
}

export function SettingsPage() {
  useDocumentTitle('WebGuard · Configuración')
  const {
    settings,
    updateSettings,
    setProtectionEnabled,
    allowlist,
    blocklist,
    resetDemo,
  } = useAppState()
  const { pushToast } = useToast()
  const [resetOpen, setResetOpen] = useState(false)

  const handleProtection = (checked: boolean) => {
    setProtectionEnabled(checked)
    pushToast({
      title: checked ? 'Protección activada' : 'Protección pausada',
      description: checked
        ? 'WebGuard volverá a analizar la navegación.'
        : 'La navegación continuará sin análisis en este prototipo.',
      tone: checked ? 'success' : 'warning',
    })
  }

  const confirmReset = () => {
    resetDemo()
    setResetOpen(false)
    pushToast({
      title: 'Datos de demostración restablecidos',
      description: 'La protección, las reglas y las listas volvieron a sus valores iniciales.',
      tone: 'info',
    })
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Configuración"
        description="Ajusta cómo se comporta WebGuard en este navegador."
        actions={
          <span className="saved-badge">
            <CheckCircle2 size={15} aria-hidden="true" />
            Guardado automático
          </span>
        }
      />

      <div className="settings-layout">
        <div className="settings-main">
          <section className="settings-card">
            <div className="settings-card__head">
              <span className="settings-card__icon">
                <Shield size={20} aria-hidden="true" />
              </span>
              <div className="settings-card__copy">
                <h2>Protección</h2>
                <p>Controla el análisis de navegación y el nivel de sensibilidad.</p>
              </div>
              <div className="settings-card__switch">
                <span className={cx('settings-state', settings.protectionEnabled ? 'is-on' : 'is-off')}>
                  {settings.protectionEnabled ? 'Activa' : 'Pausada'}
                </span>
                <Switch
                  checked={settings.protectionEnabled}
                  onChange={handleProtection}
                  label="Activar o pausar la protección"
                />
              </div>
            </div>

            {!settings.protectionEnabled ? (
              <div className="settings-notice">
                <ShieldCheck size={16} aria-hidden="true" />
                <p>
                  La protección está pausada. Los sitios no se analizan y no se muestran pantallas
                  de advertencia ni de bloqueo.
                </p>
              </div>
            ) : null}

            <div className="sensitivity">
              <div className="sensitivity__head">
                <div>
                  <h3>Nivel de sensibilidad</h3>
                  <p>{sensitivityCopy[settings.sensitivity]}</p>
                </div>
                <SegmentedControl
                  label="Nivel de sensibilidad"
                  value={settings.sensitivity}
                  onChange={(value) => updateSettings({ sensitivity: value })}
                  options={[
                    { value: 'low', label: 'Baja' },
                    { value: 'balanced', label: 'Equilibrada' },
                    { value: 'high', label: 'Alta' },
                  ]}
                />
              </div>
              <div className="sensitivity__scale" aria-hidden="true">
                <span className="is-low" />
                <span className="is-balanced" />
                <span className="is-high" />
              </div>
              <div className="sensitivity__labels" aria-hidden="true">
                <span>Menos avisos</span>
                <span>Recomendada</span>
                <span>Más avisos</span>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card__head settings-card__head--compact">
              <span className="settings-card__icon">
                <Bell size={20} aria-hidden="true" />
              </span>
              <div className="settings-card__copy">
                <h2>Alertas</h2>
                <p>Define cuándo quieres recibir avisos durante la navegación.</p>
              </div>
            </div>

            <div className="settings-rows">
              <SettingRow
                title="Advertir en riesgo medio"
                description="Muestra la pantalla de advertencia antes de permitir el acceso."
                checked={settings.alertMedium}
                onChange={(checked) => updateSettings({ alertMedium: checked })}
                label="Advertir en riesgo medio"
                icon={<SlidersHorizontal size={17} aria-hidden="true" />}
              />
              <SettingRow
                title="Bloquear automáticamente el riesgo alto"
                description="Impide la carga de sitios que superan el umbral de riesgo alto."
                checked={settings.autoBlockHigh}
                onChange={(checked) => updateSettings({ autoBlockHigh: checked })}
                label="Bloquear automáticamente el riesgo alto"
                icon={<LockKeyhole size={17} aria-hidden="true" />}
              />
              <SettingRow
                title="Notificaciones de escritorio"
                description="Envía un aviso fuera del navegador cuando se detecta una amenaza."
                checked={settings.desktopNotifications}
                onChange={(checked) => updateSettings({ desktopNotifications: checked })}
                label="Notificaciones de escritorio"
                icon={<MonitorSmartphone size={17} aria-hidden="true" />}
              />
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card__head settings-card__head--compact">
              <span className="settings-card__icon">
                <Globe2 size={20} aria-hidden="true" />
              </span>
              <div className="settings-card__copy">
                <h2>Navegación y datos</h2>
                <p>Preferencias generales del comportamiento del prototipo.</p>
              </div>
            </div>

            <div className="settings-rows">
              <SettingRow
                title="Analizar pestañas nuevas"
                description="Inicia el análisis al abrir una pestaña en un dominio nuevo."
                checked={settings.analyzeNewTabs}
                onChange={(checked) => updateSettings({ analyzeNewTabs: checked })}
                label="Analizar pestañas nuevas"
                icon={<Globe2 size={17} aria-hidden="true" />}
              />
              <SettingRow
                title="Mostrar estado en la barra del navegador"
                description="Mantén visible el icono de WebGuard y el nivel de riesgo de la pestaña."
                checked={settings.showToolbarBadge}
                onChange={(checked) => updateSettings({ showToolbarBadge: checked })}
                label="Mostrar estado en la barra del navegador"
                icon={<ShieldCheck size={17} aria-hidden="true" />}
              />
              <SettingRow
                title="Guardar estadísticas locales"
                description="Conserva los contadores y el historial solo en este navegador."
                checked={settings.localStats}
                onChange={(checked) => updateSettings({ localStats: checked })}
                label="Guardar estadísticas locales"
                icon={<BarChart3 size={17} aria-hidden="true" />}
              />
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card__head settings-card__head--compact">
              <span className="settings-card__icon">
                <Globe2 size={20} aria-hidden="true" />
              </span>
              <div className="settings-card__copy">
                <h2>Listas de dominios</h2>
                <p>Excepciones locales para permitir o bloquear sitios conocidos.</p>
              </div>
            </div>

            <div className="settings-lists">
              <DomainListEditor
                kind="allowlist"
                title="Dominios permitidos"
                description="Sitios que se consideran de confianza."
                placeholder="ejemplo: intranet.empresa.cl"
              />
              <DomainListEditor
                kind="blocklist"
                title="Dominios bloqueados"
                description="Sitios que se bloquean sin analizar."
                placeholder="ejemplo: acceso-verificacion.xyz"
              />
            </div>
          </section>
        </div>

        <aside className="settings-aside">
          <section className="panel settings-summary">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">Estado actual</h2>
                <p className="panel-subtitle">Resumen de la configuración simulada.</p>
              </div>
            </div>

            <dl className="summary-list">
              <div>
                <dt>Protección</dt>
                <dd className={settings.protectionEnabled ? 'is-safe-text' : 'is-medium-text'}>
                  {settings.protectionEnabled ? 'Activa' : 'Pausada'}
                </dd>
              </div>
              <div>
                <dt>Sensibilidad</dt>
                <dd>{sensitivityLabel[settings.sensitivity]}</dd>
              </div>
              <div>
                <dt>Alertas de riesgo medio</dt>
                <dd>{settings.alertMedium ? 'Activadas' : 'Desactivadas'}</dd>
              </div>
              <div>
                <dt>Bloqueo automático</dt>
                <dd>{settings.autoBlockHigh ? 'Activado' : 'Desactivado'}</dd>
              </div>
              <div>
                <dt>Dominios permitidos</dt>
                <dd>{allowlist.length}</dd>
              </div>
              <div>
                <dt>Dominios bloqueados</dt>
                <dd>{blocklist.length}</dd>
              </div>
            </dl>

            <div className="settings-summary__note">
              <CheckCircle2 size={15} aria-hidden="true" />
              <span>Los cambios se guardan en este navegador.</span>
            </div>
          </section>

          <section className="panel settings-preview-link">
            <span className="settings-preview-link__icon">
              <FlaskConical size={19} aria-hidden="true" />
            </span>
            <h2 className="panel-title">Revisar los estados</h2>
            <p>
              Comprueba cómo se ven el popup, la advertencia y el bloqueo con la configuración
              actual.
            </p>
            <ButtonLink to="/" variant="secondary" size="sm" fullWidth>
              Abrir centro de escenarios
            </ButtonLink>
          </section>

          <section className="panel demo-reset">
            <h2 className="panel-title">Datos de demostración</h2>
            <p>
              Restablece la protección, las reglas y las listas a sus valores iniciales. El
              historial simulado no se modifica.
            </p>
            <Button variant="ghost" size="sm" onClick={() => setResetOpen(true)}>
              <RotateCcw size={14} aria-hidden="true" />
              Restablecer datos
            </Button>
          </section>
        </aside>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Restablecer datos de demostración"
        description="Esta acción devuelve la configuración a los valores iniciales del prototipo."
        tone="danger"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmReset}>
              Restablecer
            </Button>
          </>
        }
      >
        <p className="modal-note">
          Se restablecerán la protección, el nivel de sensibilidad, las alertas, las nueve reglas y
          las listas de dominios. Los eventos simulados permanecen iguales.
        </p>
      </Modal>

      <div className="page-note">
        <Link to="/" className="text-link">
          Los controles de esta configuración no aplican bloqueos ni análisis reales.
        </Link>
      </div>
    </div>
  )
}
