import { useEffect, useMemo, useState } from 'react'
import {
  FileWarning,
  Globe2,
  Link2,
  Search,
  ShieldAlert,
  ShieldCheck,
  ListFilter,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppState } from '../context/useAppState'
import { useToast } from '../context/useToast'
import { categoryDescriptions, categoryLabels, RISK_THRESHOLDS } from '../lib/risk'
import type { RuleCategory, RuleId } from '../types'
import { PageHeader } from '../components/layout/PageHeader'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Switch } from '../components/ui/Switch'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { cx } from '../lib/cx'

const categoryIcons: Record<RuleCategory, typeof Link2> = {
  url: Link2,
  connection: Globe2,
  content: FileWarning,
}

const categoryOrder: RuleCategory[] = ['url', 'connection', 'content']

type RuleFilter = 'all' | 'enabled' | 'disabled'

export function RulesPage() {
  const { rules, toggleRule } = useAppState()
  const { pushToast } = useToast()
  const [searchParams] = useSearchParams()
  const highlight = searchParams.get('highlight')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<RuleFilter>('all')

  useEffect(() => {
    if (!highlight) return
    const target = document.getElementById(`rule-${highlight}`)
    if (target) {
      window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120)
    }
  }, [highlight])

  const filteredRules = useMemo(() => {
    const query = search.trim().toLowerCase()
    return rules.filter((rule) => {
      const matchesSearch =
        !query ||
        rule.id.toLowerCase().includes(query) ||
        rule.name.toLowerCase().includes(query) ||
        rule.description.toLowerCase().includes(query)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'enabled' && rule.enabled) ||
        (filter === 'disabled' && !rule.enabled)
      return matchesSearch && matchesFilter
    })
  }, [rules, search, filter])

  const enabledCount = rules.filter((rule) => rule.enabled).length
  const activePoints = rules
    .filter((rule) => rule.enabled)
    .reduce((total, rule) => total + rule.points, 0)
  const totalPoints = rules.reduce((total, rule) => total + rule.points, 0)

  const handleToggle = (id: RuleId, enabled: boolean) => {
    toggleRule(id)
    const rule = rules.find((candidate) => candidate.id === id)
    pushToast({
      title: enabled ? `${id} pausada` : `${id} activada`,
      description: rule
        ? `${rule.name} ${enabled ? 'dejará de sumar puntos en el prototipo.' : 'volverá a participar en el análisis simulado.'}`
        : undefined,
      tone: enabled ? 'warning' : 'success',
    })
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Reglas de detección"
        description="Indicadores ilustrativos que explican cómo WebGuard construiría su puntuación de riesgo."
        actions={
          <Link to="/preview" className="text-link">
            <ShieldAlert size={16} aria-hidden="true" />
            Ver pantallas de seguridad
          </Link>
        }
      />

      <div className="metric-strip">
        <div>
          <span className="metric-strip__label">Reglas activas</span>
          <strong>
            {enabledCount}<span className="metric-strip__suffix"> / {rules.length}</span>
          </strong>
        </div>
        <div>
          <span className="metric-strip__label">Puntos activos</span>
          <strong>
            {activePoints}<span className="metric-strip__suffix"> / {totalPoints}</span>
          </strong>
        </div>
        <div>
          <span className="metric-strip__label">Umbral de advertencia</span>
          <strong>{RISK_THRESHOLDS.medium}<span className="metric-strip__suffix"> pts</span></strong>
        </div>
        <div>
          <span className="metric-strip__label">Umbral de bloqueo</span>
          <strong>{RISK_THRESHOLDS.high}<span className="metric-strip__suffix"> pts</span></strong>
        </div>
      </div>

      <div className="rules-layout">
        <section className="rules-main">
          <div className="rules-toolbar">
            <label className="search-field">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Buscar reglas</span>
              <input
                type="search"
                placeholder="Buscar por ID, nombre o descripción…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <SegmentedControl
              label="Filtrar reglas por estado"
              size="sm"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'Todas' },
                { value: 'enabled', label: 'Activas' },
                { value: 'disabled', label: 'Pausadas' },
              ]}
            />
          </div>

          {filteredRules.length === 0 ? (
            <div className="panel">
              <EmptyState
                icon={ListFilter}
                title="No hay reglas que coincidan"
                description="Cambia el texto de búsqueda o el filtro de estado para ver otros indicadores."
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearch('')
                      setFilter('all')
                    }}
                  >
                    Mostrar todas
                  </Button>
                }
              />
            </div>
          ) : (
            categoryOrder.map((category) => {
              const categoryRules = filteredRules.filter((rule) => rule.category === category)
              if (categoryRules.length === 0) return null
              const Icon = categoryIcons[category]
              return (
                <section className="rule-group" key={category}>
                  <div className="rule-group__heading">
                    <span className="rule-group__icon">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <h2>{categoryLabels[category]}</h2>
                      <p>{categoryDescriptions[category]}</p>
                    </div>
                    <span className="rule-group__count">{categoryRules.length} reglas</span>
                  </div>

                  <div className="rule-list">
                    {categoryRules.map((rule) => (
                      <article
                        className={cx(
                          'rule-row',
                          !rule.enabled && 'is-paused',
                          highlight === rule.id && 'is-highlighted',
                        )}
                        key={rule.id}
                        id={`rule-${rule.id}`}
                      >
                        <span className="rule-row__id">{rule.id}</span>
                        <div className="rule-row__copy">
                          <div className="rule-row__title-line">
                            <h3>{rule.name}</h3>
                            {!rule.enabled ? (
                              <span className="paused-tag">Pausada</span>
                            ) : null}
                          </div>
                          <p>{rule.description}</p>
                          <p className="rule-row__detail">{rule.detail}</p>
                        </div>
                        <div className="rule-row__score">
                          <span className="rule-row__score-value">+{rule.points}</span>
                          <span className="rule-row__score-label">puntos</span>
                        </div>
                        <Switch
                          checked={rule.enabled}
                          onChange={(checked) => handleToggle(rule.id, !checked)}
                          label={`${rule.enabled ? 'Pausar' : 'Activar'} ${rule.id}`}
                        />
                      </article>
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </section>

        <aside className="rules-aside">
          <section className="panel score-guide">
            <div className="panel-heading">
              <div>
                <h2 className="panel-title">Cómo se calcula el riesgo</h2>
                <p className="panel-subtitle">
                  Cada indicador activo suma puntos. La suma determina el nivel.
                </p>
              </div>
            </div>

            <div className="score-guide__bands">
              <div className="score-guide__band is-safe">
                <span className="score-guide__range">0–29</span>
                <div>
                  <strong>Riesgo bajo</strong>
                  <p>El sitio se permite. Se mantiene la vigilancia.</p>
                </div>
                <ShieldCheck size={18} aria-hidden="true" />
              </div>
              <div className="score-guide__band is-medium">
                <span className="score-guide__range">30–69</span>
                <div>
                  <strong>Riesgo medio</strong>
                  <p>Se muestra una advertencia antes de continuar.</p>
                </div>
                <ShieldAlert size={18} aria-hidden="true" />
              </div>
              <div className="score-guide__band is-high">
                <span className="score-guide__range">70–100</span>
                <div>
                  <strong>Riesgo alto</strong>
                  <p>Se bloquea la carga del sitio.</p>
                </div>
                <ShieldAlert size={18} aria-hidden="true" />
              </div>
            </div>

            <div className="score-guide__actions">
              <Link to="/demo/warning" className="text-link">
                Ver advertencia de ejemplo
              </Link>
              <Link to="/demo/blocked" className="text-link">
                Ver bloqueo de ejemplo
              </Link>
            </div>
          </section>

          <section className="panel rules-note">
            <h2 className="panel-title">Valores ilustrativos</h2>
            <p>
              Las puntuaciones y los umbrales son parte del prototipo visual. No existe todavía un
              motor de detección ni un análisis real de URLs.
            </p>
            <p>
              Puedes pausar una regla para revisar cómo cambia el estado visual de las pantallas y de
              los eventos simulados.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
