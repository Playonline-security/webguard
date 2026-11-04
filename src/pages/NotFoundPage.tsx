import { ArrowLeft, Compass } from 'lucide-react'
import { Logo } from '../components/brand/Logo'
import { ButtonLink } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <main className="not-found">
      <Logo size="lg" />
      <span className="not-found__icon">
        <Compass size={26} aria-hidden="true" />
      </span>
      <p className="not-found__code">404</p>
      <h1>Esta página no existe</h1>
      <p>La dirección que abriste no forma parte del prototipo de WebGuard.</p>
      <ButtonLink to="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Volver al panel
      </ButtonLink>
    </main>
  )
}
