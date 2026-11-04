import { useId, useState, type FormEvent } from 'react'
import { AlertCircle, Ban, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import type { DomainListKind } from '../../types'
import { useAppState } from '../../context/useAppState'
import { useToast } from '../../context/useToast'
import { Button, IconButton } from '../ui/Button'

interface DomainListEditorProps {
  kind: DomainListKind
  title: string
  description: string
  placeholder: string
}

export function DomainListEditor({
  kind,
  title,
  description,
  placeholder,
}: DomainListEditorProps) {
  const { allowlist, blocklist, addDomain, removeDomain } = useAppState()
  const { pushToast } = useToast()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const inputId = useId()
  const domains = kind === 'allowlist' ? allowlist : blocklist
  const isAllow = kind === 'allowlist'

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const result = addDomain(kind, value)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError('')
    setValue('')
    pushToast({
      title: isAllow ? 'Dominio permitido' : 'Dominio bloqueado',
      description: `${result.domain} se añadió a la lista simulada.`,
      tone: isAllow ? 'success' : 'warning',
    })
  }

  const handleRemove = (domain: string) => {
    removeDomain(kind, domain)
    pushToast({
      title: 'Dominio eliminado',
      description: `${domain} ya no forma parte de la lista.`,
      tone: 'info',
    })
  }

  return (
    <section className={isAllow ? 'domain-list domain-list--allow' : 'domain-list domain-list--block'}>
      <div className="domain-list__head">
        <span className="domain-list__icon">
          {isAllow ? <CheckCircle2 size={18} aria-hidden="true" /> : <Ban size={18} aria-hidden="true" />}
        </span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className="domain-list__count">{domains.length}</span>
      </div>

      <form className="domain-form" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Añadir dominio a {title.toLowerCase()}
        </label>
        <input
          id={inputId}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        <Button type="submit" variant={isAllow ? 'primary' : 'danger'} size="sm">
          <Plus size={15} aria-hidden="true" />
          Añadir
        </Button>
      </form>

      {error ? (
        <p className="domain-form__error" id={`${inputId}-error`}>
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {domains.length === 0 ? (
        <p className="domain-list__empty">No hay dominios en esta lista.</p>
      ) : (
        <ul className="domain-list__items">
          {domains.map((domain) => (
            <li key={domain}>
              <span className="domain-list__dot" aria-hidden="true" />
              <span className="domain-list__domain">{domain}</span>
              <IconButton
                label={`Eliminar ${domain}`}
                className="domain-list__remove"
                onClick={() => handleRemove(domain)}
              >
                <Trash2 size={15} aria-hidden="true" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      <p className="domain-list__note">
        Las listas son locales y no aplican bloqueos reales en este prototipo.
      </p>
    </section>
  )
}
