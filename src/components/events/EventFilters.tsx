import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { AnalysisResult, RiskLevel } from '../../types'
import { resultLabels, riskLabels } from '../../lib/risk'
import { cx } from '../../lib/cx'

export type RiskFilter = 'all' | RiskLevel
export type ResultFilter = 'all' | AnalysisResult
export type EventSort = 'newest' | 'oldest' | 'score'

interface EventFiltersProps {
  search: string
  risk: RiskFilter
  result: ResultFilter
  sort: EventSort
  onSearchChange: (value: string) => void
  onRiskChange: (value: RiskFilter) => void
  onResultChange: (value: ResultFilter) => void
  onSortChange: (value: EventSort) => void
  onClear: () => void
  hasActiveFilters: boolean
}

const riskOptions: Array<{ value: RiskFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'safe', label: 'Sin riesgo' },
  { value: 'medium', label: 'Medio' },
  { value: 'high', label: 'Alto' },
]

const resultOptions: Array<{ value: ResultFilter; label: string }> = [
  { value: 'all', label: 'Todos los resultados' },
  { value: 'allowed', label: resultLabels.allowed },
  { value: 'warned', label: resultLabels.warned },
  { value: 'blocked', label: resultLabels.blocked },
]

export function EventFilters({
  search,
  risk,
  result,
  sort,
  onSearchChange,
  onRiskChange,
  onResultChange,
  onSortChange,
  onClear,
  hasActiveFilters,
}: EventFiltersProps) {
  return (
    <div className="event-filters">
      <div className="event-filters__top">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Buscar por dominio</span>
          <input
            type="search"
            placeholder="Buscar por dominio o URL…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search ? (
            <button
              type="button"
              className="search-field__clear"
              onClick={() => onSearchChange('')}
              aria-label="Limpiar búsqueda"
            >
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
        </label>

        <div className="event-filters__selects">
          <label className="select-field">
            <span>Resultado</span>
            <select
              value={result}
              onChange={(event) => onResultChange(event.target.value as ResultFilter)}
            >
              {resultOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="select-field">
            <span>Orden</span>
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value as EventSort)}
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="score">Mayor riesgo</option>
            </select>
          </label>
        </div>
      </div>

      <div className="event-filters__bottom">
        <div className="filter-group" role="group" aria-label="Filtrar por nivel de riesgo">
          <span className="filter-group__label">
            <SlidersHorizontal size={14} aria-hidden="true" />
            Riesgo
          </span>
          {riskOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cx('filter-chip', risk === option.value && 'is-active')}
              aria-pressed={risk === option.value}
              onClick={() => onRiskChange(option.value)}
            >
              {option.value !== 'all' ? (
                <i className={cx('dot', `dot--${option.value}`)} aria-hidden="true" />
              ) : null}
              {option.label}
            </button>
          ))}
        </div>

        {hasActiveFilters ? (
          <button type="button" className="text-button" onClick={onClear}>
            Limpiar filtros
          </button>
        ) : (
          <span className="event-filters__hint">
            {risk === 'all' ? 'Mostrando todos los niveles de riesgo' : riskLabels[risk]}
          </span>
        )}
      </div>
    </div>
  )
}
