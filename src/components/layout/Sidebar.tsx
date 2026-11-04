import {
  FlaskConical,
  History,
  LayoutDashboard,
  ListChecks,
  Settings2,
  ShieldCheck,
  ShieldOff,
  UserRound,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAppState } from '../../context/useAppState'
import { useToast } from '../../context/useToast'
import { Logo } from '../brand/Logo'
import { Switch } from '../ui/Switch'
import { mockEvents } from '../../data/events'
import { cx } from '../../lib/cx'

const mainNav = [
  { to: '/dashboard', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/events', label: 'Historial', icon: History, end: false, badge: mockEvents.length },
]

const controlNav = [
  { to: '/rules', label: 'Reglas de detección', icon: ListChecks },
  { to: '/settings', label: 'Configuración', icon: Settings2 },
]

export function Sidebar() {
  const { settings, setProtectionEnabled } = useAppState()
  const { pushToast } = useToast()

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

  return (
    <aside className="sidebar" aria-label="Navegación de opciones">
      <div className="sidebar__top">
        <Link to="/" className="sidebar__brand" aria-label="WebGuard, centro de escenarios">
          <Logo tone="light" size="md" />
        </Link>
        <div className="workspace">
          <span className="workspace__mark" aria-hidden="true">
            <UserRound size={17} />
          </span>
          <span className="workspace__copy">
            <span className="workspace__name">Usuario</span>
            <span className="workspace__plan">Cuenta de usuario</span>
          </span>
        </div>
        <div className="sidebar-status">
          <div className="sidebar-status__head">
            <span className={cx('status-dot', settings.protectionEnabled ? 'is-on' : 'is-off')} />
            <span>{settings.protectionEnabled ? 'Protección activa' : 'Protección pausada'}</span>
          </div>
          <p className="sidebar-status__copy">
            {settings.protectionEnabled
              ? 'Analizando la navegación en este navegador.'
              : 'No se analizarán nuevas páginas.'}
          </p>
          <div className="sidebar-status__actions">
            <span className="sidebar-status__icon" aria-hidden="true">
              {settings.protectionEnabled ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
            </span>
            <Switch
              checked={settings.protectionEnabled}
              onChange={handleProtection}
              label="Activar o pausar la protección"
            />
          </div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <Link to="/" className="sidebar__scenarios">
          <FlaskConical size={17} aria-hidden="true" />
          <span>Volver a escenarios</span>
        </Link>

        <p className="sidebar__label">Opciones</p>
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => cx('nav-item', isActive && 'is-active')}
          >
            <item.icon size={18} strokeWidth={1.9} aria-hidden="true" />
            <span>{item.label}</span>
            {item.badge ? <span className="nav-item__count">{item.badge}</span> : null}
          </NavLink>
        ))}

        <p className="sidebar__label">Control</p>
        {controlNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cx('nav-item', isActive && 'is-active')}
          >
            <item.icon size={18} strokeWidth={1.9} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__foot">
        <p className="sidebar__meta">Datos simulados · Prototipo v0.1</p>
      </div>
    </aside>
  )
}
