import { FlaskConical, ShieldCheck, ShieldOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppState } from '../../context/useAppState'
import { Logo } from '../brand/Logo'
import { cx } from '../../lib/cx'

export function ScenarioTopbar() {
  const { settings } = useAppState()

  return (
    <header className="scenario-topbar">
      <div className="scenario-topbar__left">
        <Link to="/" className="scenario-topbar__brand" aria-label="WebGuard, centro de escenarios">
          <Logo size="sm" />
        </Link>
        <span className="scenario-topbar__divider" aria-hidden="true" />
        <span className="scenario-topbar__context">
          <FlaskConical size={14} aria-hidden="true" />
          Centro de escenarios
        </span>
      </div>

      <div className="scenario-topbar__right">
        <span className="scenario-topbar__tag">Prototipo v0.1</span>
        <span
          className={cx(
            'scenario-topbar__status',
            settings.protectionEnabled ? 'is-on' : 'is-off',
          )}
        >
          {settings.protectionEnabled ? (
            <ShieldCheck size={15} aria-hidden="true" />
          ) : (
            <ShieldOff size={15} aria-hidden="true" />
          )}
          {settings.protectionEnabled ? 'Protección activa' : 'Protección pausada'}
        </span>
      </div>
    </header>
  )
}
