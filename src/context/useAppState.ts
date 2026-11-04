import { useContext } from 'react'
import { AppStateContext, type AppStateValue } from './appState'

export function useAppState(): AppStateValue {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState debe usarse dentro de AppStateProvider')
  }
  return context
}
