import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DesktopOnlyNotice } from './components/layout/DesktopOnlyNotice'
import { DashboardPage } from './pages/DashboardPage'
import { EventsPage } from './pages/EventsPage'
import { RulesPage } from './pages/RulesPage'
import { SettingsPage } from './pages/SettingsPage'
import { PreviewPage } from './pages/PreviewPage'
import { WarningPage } from './pages/WarningPage'
import { BlockedPage } from './pages/BlockedPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      <DesktopOnlyNotice />
      <Routes>
        <Route index element={<PreviewPage />} />
        <Route path="preview" element={<Navigate to="/" replace />} />
        <Route element={<AppShell />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:eventId" element={<EventsPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="demo/warning" element={<WarningPage />} />
        <Route path="demo/blocked" element={<BlockedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
