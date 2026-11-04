import { FlaskConical, ShieldCheck, ShieldOff } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAppState } from '../../context/useAppState'
import { cx } from '../../lib/cx'

const pageNames: Record<string, string> = {
  '/dashboard': 'Resumen',
  '/events': 'Historial',
  '/rules': 'Reglas de detección',
  '/settings': 'Configuración',
}

export function Topbar() {
  const { settings } = useAppState()
  const location = useLocation()
  const pathRoot =
    location.pathname === '/'
      ? '/'
      : `/${location.pathname.split('/').filter(Boolean)[0] ?? ''}`
  const pageName = pageNames[pathRoot] ?? 'WebGuard'

  return (
    <header className="topbar">
      <div className="topbar__left">
        <nav className="breadcrumb" aria-label="Miga de pan">
          <Link to="/" className="breadcrumb__home">
            WebGuard
          </Link>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          <span className="breadcrumb__context">Opciones</span>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          <span className="breadcrumb__current">{pageName}</span>
        </nav>
      </div>

      <div className="topbar__right">
        <Link to="/" className="topbar__demo">
          <FlaskConical size={15} aria-hidden="true" />
          Escenarios
        </Link>
        <Link
          to="/settings"
          className={cx(
            'protection-chip',
            settings.protectionEnabled ? 'is-on' : 'is-off',
          )}
          title="Abrir configuración de protección"
        >
          {settings.protectionEnabled ? (
            <ShieldCheck size={16} aria-hidden="true" />
          ) : (
            <ShieldOff size={16} aria-hidden="true" />
          )}
          <span>{settings.protectionEnabled ? 'Protección activa' : 'Protección pausada'}</span>
          <span className="protection-chip__dot" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
