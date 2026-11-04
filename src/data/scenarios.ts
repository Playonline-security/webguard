import type { PopupScenario, PopupScenarioId, SiteScenario } from '../types'

/**
 * DATOS SIMULADOS.
 * Los escenarios permiten revisar la interfaz sin visitar sitios reales.
 * No representan análisis en vivo ni decisiones de seguridad reales.
 */
export const warningScenario: SiteScenario = {
  id: 'warning-brand-impersonation',
  label: 'Suplantación de marca',
  domain: 'banco-central.verificacion-segura.top',
  url: 'https://banco-central.verificacion-segura.top/acceso/clientes',
  score: 63,
  risk: 'medium',
  summary:
    'El sitio imita el acceso de una entidad financiera y solicita credenciales desde un dominio que no pertenece a la marca.',
  recommendation:
    'No introduzcas tus credenciales. Si necesitas acceder al banco, escribe su dirección directamente en una pestaña nueva.',
  reasons: [
    'El dominio incluye el nombre de una entidad financiera conocida.',
    'La dirección acumula subdominios que no coinciden con la marca.',
    'La extensión del dominio tiene baja reputación en el prototipo.',
    'La página presenta un formulario de acceso sin verificación de identidad.',
  ],
  indicatorIds: ['IND02', 'IND06', 'IND07', 'IND09'],
}

export const blockScenario: SiteScenario = {
  id: 'block-ip-office',
  label: 'IP directa y suplantación',
  domain: '185.62.190.44',
  url: 'http://185.62.190.44/secure/office365/account-verification/login.php?session=active',
  score: 94,
  risk: 'high',
  summary:
    'La página combina una conexión sin cifrar, una dirección IP directa y un formulario que imita el acceso de Office 365.',
  recommendation:
    'WebGuard detuvo la carga antes de que pudieras introducir datos. Verifica la comunicación con tu proveedor por un canal oficial.',
  reasons: [
    'La dirección usa una IP en lugar de un dominio verificable.',
    'La conexión no utiliza HTTPS.',
    'El formulario imita el acceso de Office 365.',
    'La URL contiene una ruta larga de verificación de cuenta.',
  ],
  indicatorIds: ['IND01', 'IND04', 'IND05', 'IND07', 'IND09'],
}

export const popupScenarios: Record<PopupScenarioId, PopupScenario> = {
  idle: {
    id: 'idle',
    label: 'Sin actividad',
    shortLabel: 'Inicio',
    description: 'La extensión está lista y aún no ha analizado la navegación de esta pestaña.',
    domain: 'Sin pestaña analizada',
    url: '',
    score: 0,
    risk: 'safe',
    summary:
      'Aún no hay actividad en esta pestaña. WebGuard analizará cada sitio cuando comiences a navegar.',
    indicatorIds: [],
  },
  safe: {
    id: 'safe',
    label: 'Sitio seguro',
    shortLabel: 'Seguro',
    description: 'Dominio verificado, certificado válido y sin señales de riesgo.',
    domain: 'github.com',
    url: 'https://github.com/vercel/next.js',
    score: 0,
    risk: 'safe',
    summary:
      'Certificado válido, dominio con buena reputación y sin formularios que soliciten credenciales.',
    indicatorIds: [],
  },
  medium: {
    id: 'medium',
    label: 'Riesgo medio',
    shortLabel: 'Precaución',
    description: 'Señales de suplantación que requieren revisión antes de continuar.',
    domain: warningScenario.domain,
    url: warningScenario.url,
    score: warningScenario.score,
    risk: 'medium',
    summary: warningScenario.summary,
    indicatorIds: warningScenario.indicatorIds,
  },
  high: {
    id: 'high',
    label: 'Riesgo alto',
    shortLabel: 'Bloqueado',
    description: 'Indicadores críticos combinados; el sitio está bloqueado.',
    domain: blockScenario.domain,
    url: blockScenario.url,
    score: blockScenario.score,
    risk: 'high',
    summary: blockScenario.summary,
    indicatorIds: blockScenario.indicatorIds,
  },
  disabled: {
    id: 'disabled',
    label: 'Protección desactivada',
    shortLabel: 'Desactivada',
    description: 'La navegación continúa sin análisis ni advertencias.',
    domain: 'github.com',
    url: 'https://github.com/vercel/next.js',
    score: 0,
    risk: 'safe',
    summary:
      'La protección está en pausa. WebGuard no está analizando esta pestaña ni mostrará advertencias.',
    indicatorIds: [],
  },
  scanning: {
    id: 'scanning',
    label: 'Análisis en curso',
    shortLabel: 'Analizando',
    description: 'Comprobaciones de URL, conexión, reputación y formularios.',
    domain: 'nuevo-proveedor.com',
    url: 'https://nuevo-proveedor.com/portal/acceso',
    score: 0,
    risk: 'safe',
    summary:
      'WebGuard está revisando la estructura de la URL, la conexión y la reputación del dominio.',
    indicatorIds: [],
  },
}
