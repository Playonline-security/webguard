import { ArrowLeft, Compass } from 'lucide-react'
import { Logo } from '../components/brand/Logo'
import { ButtonLink } from '../components/ui/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('WebGuard · Página no encontrada')
  return (
    <main className="not-found" id="main-content">
      <Logo size="lg" />
      <span className="not-found__icon">
        <Compass size={26} aria-hidden="true" />
      </span>
      <p className="not-found__code">404</p>
      <h1>Esta página no existe</h1>
      <p>La dirección que abriste no forma parte del prototipo de WebGuard.</p>
      <ButtonLink to="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Volver a escenarios
      </ButtonLink>
    </main>
  )
}
