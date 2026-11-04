import {
  FlaskConical,
  History,
  LayoutDashboard,
  ListChecks,
  Settings2,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAppState } from '../../context/useAppState'
import { useToast } from '../../context/useToast'
import { ButtonLink } from '../ui/Button'
import { Logo } from '../brand/Logo'
import { Switch } from '../ui/Switch'
import { mockEvents } from '../../data/events'
import { cx } from '../../lib/cx'

interface SidebarProps {
  open: boolean
  onNavigate: () => void
}

const mainNav = [
  { to: '/', label: 'Resumen', icon: LayoutDashboard, end: true },
  { to: '/events', label: 'Historial', icon: History, end: false, badge: mockEvents.length },
]

const controlNav = [
  { to: '/rules', label: 'Reglas de detección', icon: ListChecks },
  { to: '/settings', label: 'Configuración', icon: Settings2 },
]

export function Sidebar({ open, onNavigate }: SidebarProps) {
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
    <aside className={cx('sidebar', open && 'is-open')} aria-label="Navegación principal">
      <div className="sidebar__top">
        <Link to="/" className="sidebar__brand" onClick={onNavigate} aria-label="WebGuard, inicio">
          <Logo tone="light" size="md" />
        </Link>
        <div className="workspace">
          <span className="workspace__mark">AN</span>
          <span className="workspace__copy">
            <span className="workspace__name">Atelier Norte</span>
            <span className="workspace__plan">Espacio de trabajo</span>
          </span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <p className="sidebar__label">Panel</p>
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
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
            onClick={onNavigate}
            className={({ isActive }) => cx('nav-item', isActive && 'is-active')}
          >
            <item.icon size={18} strokeWidth={1.9} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <p className="sidebar__label sidebar__label--prototype">Prototipo</p>
        <NavLink
          to="/preview"
          onClick={onNavigate}
          className={({ isActive }) => cx('nav-item nav-item--demo', isActive && 'is-active')}
        >
          <FlaskConical size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>Centro de escenarios</span>
          <span className="nav-item__demo">Demo</span>
        </NavLink>
      </nav>

      <div className="sidebar__foot">
        <div className="sidebar-status">
          <div className="sidebar-status__head">
            <span className={cx('status-dot', settings.protectionEnabled ? 'is-on' : 'is-off')} />
            <span>{settings.protectionEnabled ? 'Protección activa' : 'Protección pausada'}</span>
          </div>
          <p className="sidebar-status__copy">
            {settings.protectionEnabled
              ? 'Analizando la navegación de este equipo.'
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
        <ButtonLink
          to="/settings"
          variant="quiet"
          size="sm"
          className="sidebar__settings-link"
          onClick={onNavigate}
        >
          <Settings2 size={14} aria-hidden="true" />
          Ajustes de protección
        </ButtonLink>
        <p className="sidebar__meta">Datos simulados · Prototipo v0.1</p>
      </div>
    </aside>
  )
}
