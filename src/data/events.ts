import type { AnalysisResult, RiskLevel, RuleId, SecurityEvent } from '../types'
import { riskFromScore, sumPoints } from '../lib/risk'
import { initialRules } from './rules'

/**
 * DATOS SIMULADOS.
 * Los eventos se generan localmente con marcas de tiempo relativas a la sesión.
 * Ningún dominio se visita, analiza ni bloquea realmente.
 */
interface EventSeed {
  domain: string
  url: string
  minutesAgo: number
  indicatorIds: RuleId[]
}

const seeds: EventSeed[] = [
  {
    domain: '185.62.190.44',
    url: 'http://185.62.190.44/secure/office365/account-verification/login.php?session=active',
    minutesAgo: 8,
    indicatorIds: ['IND01', 'IND04', 'IND05', 'IND07', 'IND09'],
  },
  {
    domain: 'banco-central.verificacion-segura.top',
    url: 'https://banco-central.verificacion-segura.top/acceso/clientes',
    minutesAgo: 24,
    indicatorIds: ['IND02', 'IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'paypa1-secure-verification.top',
    url: 'https://paypa1-secure-verification.top/login/account/confirm?session=8f2c1a77&redirect=wallet',
    minutesAgo: 42,
    indicatorIds: ['IND01', 'IND03', 'IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'office365-auth-check.xyz',
    url: 'https://office365-auth-check.xyz/signin',
    minutesAgo: 65,
    indicatorIds: ['IND06', 'IND07', 'IND09'],
  },
  {
    domain: '203.0.113.74',
    url: 'http://203.0.113.74/wp-admin/verify.php?auth=1',
    minutesAgo: 92,
    indicatorIds: ['IND03', 'IND04', 'IND05', 'IND09'],
  },
  {
    domain: 'secure-login.bancoestado-verifica.com',
    url: 'https://secure-login.bancoestado-verifica.com/ingreso',
    minutesAgo: 130,
    indicatorIds: ['IND02', 'IND07', 'IND09'],
  },
  {
    domain: 'microsoft-support-auth.xyz',
    url: 'https://microsoft-support-auth.xyz/session/verify/account/security-check/upload/document?ref=mail',
    minutesAgo: 185,
    indicatorIds: ['IND01', 'IND03', 'IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'envia-seguropaquete.click',
    url: 'http://envia-seguropaquete.click/rastreo',
    minutesAgo: 240,
    indicatorIds: ['IND05', 'IND06', 'IND07'],
  },
  {
    domain: 'dhl-rastreo-express.click',
    url: 'https://dhl-rastreo-express.click/tracking/package/verification?code=8841-AX&redirect=info',
    minutesAgo: 310,
    indicatorIds: ['IND01', 'IND03', 'IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'facturacion-sii-cl.top',
    url: 'https://facturacion-sii-cl.top/portal',
    minutesAgo: 390,
    indicatorIds: ['IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'app-lemon-cash.secure-billing.top',
    url: 'http://app-lemon-cash.secure-billing.top/session/verify',
    minutesAgo: 560,
    indicatorIds: ['IND02', 'IND05', 'IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'instagram-verificacion-cuenta.net',
    url: 'https://instagram-verificacion-cuenta.net/form/verify',
    minutesAgo: 680,
    indicatorIds: ['IND07', 'IND09'],
  },
  {
    domain: 'soporte-microsoft365.top',
    url: 'https://soporte-microsoft365.top/chat/support',
    minutesAgo: 910,
    indicatorIds: ['IND06', 'IND07'],
  },
  {
    domain: 'netflix-account-verify.xyz',
    url: 'https://netflix-account-verify.xyz/login/update-payment?return=account&lang=es-CL',
    minutesAgo: 1100,
    indicatorIds: ['IND01', 'IND03', 'IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'formulario-afiliacion.salud-vital.xyz',
    url: 'https://formulario-afiliacion.salud-vital.xyz/registro',
    minutesAgo: 1350,
    indicatorIds: ['IND02', 'IND06', 'IND09'],
  },
  {
    domain: 'github.com',
    url: 'https://github.com/vercel/next.js',
    minutesAgo: 1600,
    indicatorIds: [],
  },
  {
    domain: 'banco-andino.secure-access.click',
    url: 'https://banco-andino.secure-access.click/acceso',
    minutesAgo: 1900,
    indicatorIds: ['IND02', 'IND06', 'IND07'],
  },
  {
    domain: 'stripe.com',
    url: 'https://dashboard.stripe.com/payments',
    minutesAgo: 2300,
    indicatorIds: [],
  },
  {
    domain: '91.214.124.18',
    url: 'http://91.214.124.18/office365/login.php',
    minutesAgo: 2800,
    indicatorIds: ['IND04', 'IND05', 'IND07', 'IND09'],
  },
  {
    domain: 'apple-id-verificacion.xyz',
    url: 'https://apple-id-verificacion.xyz/cuenta',
    minutesAgo: 3300,
    indicatorIds: ['IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'shopify.com',
    url: 'https://admin.shopify.com/store/atelier-norte',
    minutesAgo: 3900,
    indicatorIds: [],
  },
  {
    domain: 'dropbox-preview-share.xyz',
    url: 'https://dropbox-preview-share.xyz/view/file',
    minutesAgo: 4700,
    indicatorIds: ['IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'notion.so',
    url: 'https://www.notion.so/atelier-norte',
    minutesAgo: 5600,
    indicatorIds: [],
  },
  {
    domain: 'google-drive-shared-doc.click',
    url: 'https://google-drive-shared-doc.click/document/open',
    minutesAgo: 6500,
    indicatorIds: ['IND06', 'IND07', 'IND09'],
  },
  {
    domain: 'figma.com',
    url: 'https://www.figma.com/files/team/atelier-norte',
    minutesAgo: 7600,
    indicatorIds: [],
  },
  {
    domain: 'mercadolibre.com',
    url: 'https://www.mercadolibre.com/',
    minutesAgo: 8900,
    indicatorIds: [],
  },
  {
    domain: 'google.com',
    url: 'https://mail.google.com/',
    minutesAgo: 10200,
    indicatorIds: [],
  },
  {
    domain: 'slack.com',
    url: 'https://app.slack.com/client/atelier-norte',
    minutesAgo: 11800,
    indicatorIds: [],
  },
  {
    domain: 'dropbox.com',
    url: 'https://www.dropbox.com/home',
    minutesAgo: 13500,
    indicatorIds: [],
  },
  {
    domain: 'contabilidad-norte.cl',
    url: 'https://contabilidad-norte.cl/portal/clientes/documentos/2026/noviembre/conciliacion',
    minutesAgo: 15600,
    indicatorIds: ['IND01'],
  },
]

const baseTime = Date.now()

function resultForRisk(risk: RiskLevel): AnalysisResult {
  if (risk === 'high') return 'blocked'
  if (risk === 'medium') return 'warned'
  return 'allowed'
}

export const mockEvents: SecurityEvent[] = seeds
  .map((seed) => {
    const score = sumPoints(initialRules, seed.indicatorIds)
    const risk = riskFromScore(score)
    return {
      id: '',
      domain: seed.domain,
      url: seed.url,
      timestamp: new Date(baseTime - seed.minutesAgo * 60_000).toISOString(),
      score,
      risk,
      result: resultForRisk(risk),
      indicatorIds: seed.indicatorIds,
    }
  })
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .map((event, index) => ({ ...event, id: `EVT-${3400 - index}` }))
