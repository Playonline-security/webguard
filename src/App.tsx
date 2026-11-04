import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
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
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:eventId" element={<EventsPage />} />
        <Route path="rules" element={<RulesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="preview" element={<PreviewPage />} />
      </Route>
      <Route path="demo/warning" element={<WarningPage />} />
      <Route path="demo/blocked" element={<BlockedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
