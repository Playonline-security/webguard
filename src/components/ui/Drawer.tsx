import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      window.requestAnimationFrame(() => {
        dialog.querySelector<HTMLElement>('.drawer__close')?.focus()
      })
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="drawer"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="drawer__panel">
        <div className="drawer__header">
          <h2 id={titleId} className="drawer__title">
            {title}
          </h2>
          <button
            type="button"
            className="drawer__close"
            onClick={onClose}
            aria-label="Cerrar detalle"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {footer ? <div className="drawer__footer">{footer}</div> : null}
      </div>
    </dialog>
  )
}
