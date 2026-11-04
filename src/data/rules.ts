import type { Rule } from '../types'

/**
 * DATOS SIMULADOS.
 * Estas reglas y puntuaciones son ilustrativas para el prototipo visual.
 * No existe un motor de detección ni se analizan URLs reales.
 */
export const initialRules: Rule[] = [
  {
    id: 'IND01',
    name: 'Longitud anómala de URL',
    description: 'La dirección supera la longitud habitual para un sitio legítimo.',
    detail:
      'Las URLs muy largas suelen ocultar rutas de redirección, parámetros de sesión o dominios incrustados. En este prototipo se usa un umbral ilustrativo de 75 caracteres.',
    points: 12,
    category: 'url',
    enabled: true,
  },
  {
    id: 'IND02',
    name: 'Exceso de subdominios',
    description: 'El dominio acumula más niveles de los necesarios para identificar el sitio.',
    detail:
      'Un número elevado de subdominios puede imitar la estructura de una marca conocida. El umbral ilustrativo es de más de tres niveles antes del dominio principal.',
    points: 10,
    category: 'url',
    enabled: true,
  },
  {
    id: 'IND03',
    name: 'Caracteres especiales inusuales',
    description: 'La URL contiene combinaciones poco habituales de símbolos y parámetros.',
    detail:
      'Secuencias como múltiples guiones, signos de interrogación encadenados o parámetros de redirección pueden indicar una dirección construida para evadir filtros.',
    points: 14,
    category: 'url',
    enabled: true,
  },
  {
    id: 'IND04',
    name: 'Dirección IP en lugar de dominio',
    description: 'Se accede al sitio mediante una dirección numérica en vez de un nombre.',
    detail:
      'Los servicios legítimos suelen usar un dominio verificable. Una IP directa dificulta comprobar la identidad y la reputación del sitio.',
    points: 25,
    category: 'connection',
    enabled: true,
  },
  {
    id: 'IND05',
    name: 'Ausencia de HTTPS',
    description: 'La conexión no está cifrada y los datos pueden viajar sin protección.',
    detail:
      'Sin HTTPS no es posible garantizar la integridad del contenido ni la confidencialidad de lo que se envía. Es especialmente crítico en formularios de acceso.',
    points: 20,
    category: 'connection',
    enabled: true,
  },
  {
    id: 'IND06',
    name: 'Dominio con extensión de riesgo',
    description: 'El dominio usa una extensión asociada con campañas de abuso.',
    detail:
      'Extensiones de bajo coste y alta rotación se usan con frecuencia en campañas de phishing. En el prototipo se ejemplifican .xyz, .top, .click y .help.',
    points: 16,
    category: 'connection',
    enabled: true,
  },
  {
    id: 'IND07',
    name: 'Palabras de suplantación de marca',
    description: 'El dominio incluye términos de marcas o servicios conocidos.',
    detail:
      'La presencia de nombres de marcas, áreas de soporte o verificaciones en un dominio ajeno es una señal frecuente de suplantación.',
    points: 22,
    category: 'content',
    enabled: true,
  },
  {
    id: 'IND08',
    name: 'Unicode o Punycode sospechoso',
    description: 'El nombre del dominio mezcla alfabetos o usa una codificación engañosa.',
    detail:
      'Los caracteres Unicode visualmente similares a letras latinas pueden hacer que un dominio parezca legítimo. El prototipo muestra esta regla como referencia.',
    points: 18,
    category: 'content',
    enabled: true,
  },
  {
    id: 'IND09',
    name: 'Formulario no confiable',
    description: 'La página solicita credenciales o datos personales sin garantías suficientes.',
    detail:
      'Un formulario de acceso combinado con otros indicadores eleva el riesgo de robo de credenciales. La evaluación final es ilustrativa en esta fase.',
    points: 15,
    category: 'content',
    enabled: true,
  },
]
