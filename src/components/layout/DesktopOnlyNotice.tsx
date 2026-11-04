import { useEffect, useState } from 'react'
import { Monitor } from 'lucide-react'
import { Logo } from '../brand/Logo'

export function DesktopOnlyNotice() {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1099px)')
    const update = () => setIsCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isCompact) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isCompact])

  if (!isCompact) return null

  return (
    <div className="desktop-only" role="alert" aria-live="polite">
      <div className="desktop-only__panel">
        <Logo size="lg" tone="light" />
        <span className="desktop-only__icon">
          <Monitor size={30} aria-hidden="true" />
        </span>
        <p className="desktop-only__kicker">Prototipo de escritorio</p>
        <h1>Amplía la ventana para continuar</h1>
        <p>
          WebGuard está diseñado para revisarse en Google Chrome o Firefox con un ancho mínimo de
          1100 px. La experiencia móvil no forma parte de este prototipo.
        </p>
      </div>
    </div>
  )
}
