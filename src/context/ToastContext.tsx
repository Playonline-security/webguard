import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from 'lucide-react'
import { ToastContext, type Toast } from './toast'

const toneIcons = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  error: XCircle,
} as const

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)
  const timers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const pushToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      counter.current += 1
      const id = counter.current
      setToasts((current) => [...current.slice(-3), { ...toast, id }])
      const timer = window.setTimeout(() => dismiss(id), 4200)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  useEffect(() => {
    const activeTimers = timers.current
    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="toast-region" role="status" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => {
          const Icon = toneIcons[toast.tone]
          return (
            <div className={`toast toast--${toast.tone}`} key={toast.id}>
              <Icon size={18} aria-hidden="true" />
              <div className="toast__copy">
                <p className="toast__title">{toast.title}</p>
                {toast.description ? (
                  <p className="toast__description">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="toast__close"
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar notificación"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
