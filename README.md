# WebGuard · Prototipo de interfaz

Prototipo frontend interactivo de WebGuard, una extensión conceptual de protección de navegación. Incluye el panel de control, el historial de eventos, las reglas de detección, la configuración y un centro de escenarios para revisar el popup de la extensión y las pantallas de advertencia y bloqueo.

> **Todo es simulado.** No hay backend, base de datos, motor de detección, manifest de Chrome, content scripts ni bloqueo real. Los dominios, eventos, puntuaciones y decisiones son datos locales de demostración.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Un navegador moderno (Chrome recomendado)

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite, normalmente `http://localhost:5173`.

### Otros comandos

```bash
npm run build     # comprobación de tipos y compilación de producción
npm run preview   # sirve la compilación de dist/
npm run lint      # análisis estático con oxlint
```

## Recorrido del prototipo

### Interfaz principal

- `/` — Resumen de protección: estado, métricas por periodo, actividad, distribución de riesgo, eventos recientes e indicadores frecuentes.
- `/events` — Historial de 30 eventos simulados con búsqueda, filtros por riesgo y resultado, orden, paginación, detalle lateral y exportación CSV.
- `/events/:eventId` — Historial con el detalle del evento abierto en un panel lateral.
- `/rules` — Las nueve reglas de detección con sus pesos, búsqueda, filtros, activación individual y guía de umbrales.
- `/settings` — Protección, sensibilidad, alertas, preferencias generales, listas de dominios y restablecimiento de datos.
- `/preview` — Centro de escenarios, marcado como herramienta exclusiva del prototipo.

### Pantallas de seguridad

- `/demo/warning` — Advertencia de riesgo medio, con confirmación para continuar.
- `/demo/blocked` — Bloqueo de riesgo alto, sin opción de continuar; incluye copia del informe o presentación manual si el portapapeles está restringido.
- `/preview?tab=warning` y `/preview?tab=blocked` — Las mismas pantallas dentro del centro de escenarios a escala.

### Centro de escenarios

El centro permite revisar sin instalar nada:

- Los cinco estados del popup: seguro, riesgo medio, riesgo alto, protección desactivada y análisis en curso.
- La advertencia y el bloqueo con resumen del dominio, puntuación, indicadores y acciones.
- Una galería de componentes: estados de riesgo, medidores, indicadores, botones, etiquetas y controles interactivos.

Los parámetros `tab` y `state` se sincronizan con la URL, por lo que se puede enlazar una vista concreta, por ejemplo:

```text
/preview?tab=popup&state=medium
```

## Puntuación simulada

| Regla | Puntos |
| --- | ---: |
| IND01 · Longitud anómala de URL | 12 |
| IND02 · Exceso de subdominios | 10 |
| IND03 · Caracteres especiales inusuales | 14 |
| IND04 · Dirección IP en lugar de dominio | 25 |
| IND05 · Ausencia de HTTPS | 20 |
| IND06 · Dominio con extensión de riesgo | 16 |
| IND07 · Palabras de suplantación de marca | 22 |
| IND08 · Unicode o Punycode sospechoso | 18 |
| IND09 · Formulario no confiable | 15 |

Umbrales:

- **0–29:** riesgo bajo, el sitio se permite.
- **30–69:** riesgo medio, se muestra una advertencia.
- **70–100:** riesgo alto, se bloquea la carga.

Al pausar una regla desde `/rules`, sus puntos dejan de contar en las métricas del prototipo.

## Persistencia local

La configuración, el estado de las reglas y las listas de dominios se guardan en `localStorage` con la clave `webguard-demo-state-v1`. El historial de eventos es fijo y no se modifica.

Para volver a los valores iniciales:

1. Entra en **Configuración**.
2. Pulsa **Restablecer datos** y confirma.

También puedes borrar la clave desde las herramientas de desarrollo del navegador.

## Estructura

```text
src/
  components/     Componentes de layout, dashboard, eventos, settings, popup, seguridad y preview
  context/        Estado global de la demo y notificaciones
  data/           Eventos, reglas, escenarios, estadísticas y dominios simulados
  lib/            Utilidades de riesgo, formato, almacenamiento y clases
  pages/          Rutas de la aplicación
  styles/         Tokens y estilos por área
  types/          Tipos compartidos
```

## Alcance y límites

- No se realiza ninguna petición a dominios reales.
- No existe una extensión empaquetada ni un `manifest.json`.
- No se analiza tráfico, URL, certificados, formularios ni reputación real.
- No se envían notificaciones al sistema operativo.
- La exportación CSV y las listas de dominios son locales al navegador.
- El centro de escenarios forma parte de las herramientas de revisión y no de la interfaz final.
