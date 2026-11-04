import { ShieldCheck, ShieldX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { cx } from '../../lib/cx'

export function SecurityHeader({ variant = 'warning' }: { variant?: 'warning' | 'blocked' }) {
  return (
    <header className="security-header">
      <Logo size="sm" />
      <span className={cx('security-header__context', `is-${variant}`)}>
        {variant === 'blocked' ? (
          <ShieldX size={15} aria-hidden="true" />
        ) : (
          <ShieldCheck size={15} aria-hidden="true" />
        )}
        {variant === 'blocked' ? 'Sitio bloqueado' : 'Protección de navegación'}
      </span>
    </header>
  )
}

export function SecurityFooter() {
  return (
    <footer className="security-footer">
      <span>WebGuard · Prototipo visual</span>
      <span>Datos simulados. Ninguna página real fue analizada ni bloqueada.</span>
      <Link to="/" className="security-footer__link">
        Volver al centro de escenarios
      </Link>
    </footer>
  )
}
