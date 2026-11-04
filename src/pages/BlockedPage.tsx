import { BlockScreen } from '../components/security/BlockScreen'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function BlockedPage() {
  useDocumentTitle('WebGuard · Bloqueo de riesgo alto')
  return <BlockScreen />
}
