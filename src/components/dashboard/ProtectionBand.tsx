import { Pause, Settings2, ShieldCheck, ShieldOff } from 'lucide-react'
import type { PeriodStats } from '../../types'
import { formatNumber } from '../../lib/format'
import { Button, ButtonLink } from '../ui/Button'
import { Watchline } from './Watchline'
import { cx } from '../../lib/cx'

interface ProtectionBandProps {
  stats: PeriodStats
  enabled: boolean
  onToggle: () => void
}

export function ProtectionBand({ stats, enabled, onToggle }: ProtectionBandProps) {
  return (
    <section className={cx('protection-band', !enabled && 'is-paused')}>
      <div className="protection-band__main">
        <div className="protection-band__status">
          <span className="protection-band__icon">
            {enabled ? (
              <ShieldCheck size={26} aria-hidden="true" />
            ) : (
              <ShieldOff size={26} aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="protection-band__kicker">Estado de protección</p>
            <h2 className="protection-band__title">
              {enabled ? 'Protección activa' : 'Protección pausada'}
            </h2>
            <p className="protection-band__copy">
              {enabled
                ? 'WebGuard analiza la navegación de este equipo y detiene los sitios de alto riesgo.'
                : 'No se analizarán páginas nuevas hasta que reactives la protección.'}
            </p>
          </div>
        </div>

        <div className="protection-band__metrics">
          <div>
            <span>Sitios analizados</span>
            <strong>{formatNumber(stats.analyzed)}</strong>
          </div>
          <div>
            <span>Amenazas detectadas</span>
            <strong>{formatNumber(stats.threats)}</strong>
          </div>
          <div>
            <span>Sitios bloqueados</span>
            <strong>{formatNumber(stats.blocked)}</strong>
          </div>
        </div>

        <div className="protection-band__actions">
          <Button
            variant={enabled ? 'secondary-inverse' : 'primary'}
            size="sm"
            onClick={onToggle}
          >
            {enabled ? <Pause size={14} aria-hidden="true" /> : <ShieldCheck size={14} aria-hidden="true" />}
            {enabled ? 'Pausar protección' : 'Activar protección'}
          </Button>
          <ButtonLink to="/settings" variant="quiet-inverse" size="sm">
            <Settings2 size={14} aria-hidden="true" />
            Configurar
          </ButtonLink>
        </div>
      </div>

      <Watchline enabled={enabled} />
    </section>
  )
}
