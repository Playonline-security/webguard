import { createContext } from 'react'

export type ToastTone = 'success' | 'info' | 'warning' | 'error'

export interface Toast {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

export interface ToastContextValue {
  pushToast: (toast: Omit<Toast, 'id'>) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
