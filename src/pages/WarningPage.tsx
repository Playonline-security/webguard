import { WarningScreen } from '../components/security/WarningScreen'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function WarningPage() {
  useDocumentTitle('WebGuard · Advertencia de riesgo medio')
  return <WarningScreen />
}
