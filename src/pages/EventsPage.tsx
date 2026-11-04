import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, SearchX } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { mockEvents } from '../data/events'
import { useToast } from '../context/useToast'
import {
  EventFilters,
  type EventSort,
  type ResultFilter,
  type RiskFilter,
} from '../components/events/EventFilters'
import { EventTable } from '../components/events/EventTable'
import { EventDetail } from '../components/events/EventDetail'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Drawer } from '../components/ui/Drawer'
import { formatNumber } from '../lib/format'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const PAGE_SIZE = 8

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

export function EventsPage() {
  useDocumentTitle('WebGuard · Historial')
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { pushToast } = useToast()

  const [search, setSearch] = useState('')
  const [risk, setRisk] = useState<RiskFilter>('all')
  const [result, setResult] = useState<ResultFilter>('all')
  const [sort, setSort] = useState<EventSort>('newest')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const next = mockEvents.filter((event) => {
      const matchesQuery =
        !query ||
        event.domain.toLowerCase().includes(query) ||
        event.url.toLowerCase().includes(query)
      const matchesRisk = risk === 'all' || event.risk === risk
      const matchesResult = result === 'all' || event.result === result
      return matchesQuery && matchesRisk && matchesResult
    })

    return next.sort((a, b) => {
      if (sort === 'score') return b.score - a.score
      const diff = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      return sort === 'oldest' ? -diff : diff
    })
  }, [search, risk, result, sort])

  const updateSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const updateRisk = (value: RiskFilter) => {
    setRisk(value)
    setPage(1)
  }

  const updateResult = (value: ResultFilter) => {
    setResult(value)
    setPage(1)
  }

  const updateSort = (value: EventSort) => {
    setSort(value)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const selectedEvent = eventId ? mockEvents.find((event) => event.id === eventId) : undefined
  const hasActiveFilters = search.trim() !== '' || risk !== 'all' || result !== 'all'

  const clearFilters = () => {
    setSearch('')
    setRisk('all')
    setResult('all')
    setSort('newest')
    setPage(1)
  }

  const exportCsv = () => {
    if (filtered.length === 0) return
    const rows = [
      ['ID', 'Dominio', 'URL', 'Fecha', 'Riesgo', 'Puntuación', 'Resultado', 'Indicadores'],
      ...filtered.map((event) => [
        event.id,
        event.domain,
        event.url,
        event.timestamp,
        event.risk,
        String(event.score),
        event.result,
        event.indicatorIds.join(' '),
      ]),
    ]
    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `webguard-eventos-simulados-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
    pushToast({
      title: 'Exportación preparada',
      description: `Se descargaron ${filtered.length} eventos simulados en formato CSV.`,
      tone: 'success',
    })
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Historial de eventos"
        description="Consulta los sitios analizados, el nivel de riesgo asignado y los indicadores detectados."
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download size={16} aria-hidden="true" />
            Exportar CSV
          </Button>
        }
      />

      <div className="event-summary">
        <div>
          <span className="event-summary__value">{formatNumber(mockEvents.length)}</span>
          <span className="event-summary__label">eventos registrados</span>
        </div>
        <div className="event-summary__legend">
          <span><i className="dot dot--safe" /> {mockEvents.filter((event) => event.risk === 'safe').length} sin riesgo</span>
          <span><i className="dot dot--medium" /> {mockEvents.filter((event) => event.risk === 'medium').length} medio</span>
          <span><i className="dot dot--high" /> {mockEvents.filter((event) => event.risk === 'high').length} alto</span>
        </div>
        <span className="event-summary__note">Datos simulados · sin análisis real</span>
      </div>

      <section className="panel panel--table">
        <EventFilters
          search={search}
          risk={risk}
          result={result}
          sort={sort}
          onSearchChange={updateSearch}
          onRiskChange={updateRisk}
          onResultChange={updateResult}
          onSortChange={updateSort}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {visible.length > 0 ? (
          <>
            <EventTable events={visible} />
            <div className="pagination">
              <span className="pagination__info">
                Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} de{' '}
                {formatNumber(filtered.length)}
              </span>
              <div className="pagination__controls">
                <button
                  type="button"
                  className="pagination__arrow"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                  <button
                    type="button"
                    key={number}
                    className={`pagination__page ${number === currentPage ? 'is-active' : ''}`}
                    onClick={() => setPage(number)}
                    aria-label={`Ir a la página ${number}`}
                    aria-current={number === currentPage ? 'page' : undefined}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  className="pagination__arrow"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No encontramos eventos"
            description="Prueba con otro dominio o cambia los filtros de riesgo y resultado."
            action={
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            }
          />
        )}
      </section>

      <Drawer
        open={Boolean(selectedEvent)}
        onClose={() => navigate('/events')}
        title="Detalle del evento"
      >
        {selectedEvent ? (
          <EventDetail event={selectedEvent} onClose={() => navigate('/events')} />
        ) : null}
      </Drawer>
    </div>
  )
}
