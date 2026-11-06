# WebGuard · Prototipo de interfaz

Prototipo frontend interactivo de WebGuard, una extensión conceptual de protección de navegación. El centro de escenarios es la página de inicio y desde el popup se accede al resumen, el historial de eventos, las reglas de detección y la configuración. También permite revisar las pantallas de advertencia y bloqueo a tamaño completo.

> **Todo es simulado.** No hay backend, base de datos, motor de detección, manifest de Chrome, content scripts ni bloqueo real. Los dominios, eventos, puntuaciones y decisiones son datos locales de demostración.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Google Chrome o Firefox actualizado, con una ventana de al menos 1100 px de ancho

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

## Publicación

El prototipo se publica en GitHub Pages:

```text
https://playonline-security.github.io/webguard/
```

Cada push a `main` ejecuta el workflow `.github/workflows/deploy-pages.yml`, que instala dependencias, ejecuta el lint, compila el proyecto y publica `dist/`. También se puede relanzar manualmente desde **Actions → Deploy GitHub Pages → Run workflow**.

En GitHub, la fuente de publicación debe estar configurada en **Settings → Pages → Build and deployment → Source: GitHub Actions**.

La compilación de producción usa la base `/webguard/`, mientras que el servidor de desarrollo sigue funcionando en la raíz. El workflow genera `404.html` a partir de `index.html` para que las rutas internas funcionen al recargar directamente en GitHub Pages.

## Recorrido del prototipo

### Interfaz principal

- `/` — Centro de escenarios: página de inicio del prototipo, con acceso al popup, la advertencia, el bloqueo y la galería de componentes.
- `/dashboard` — Resumen de protección: estado, métricas por periodo, actividad, distribución de riesgo, eventos recientes e indicadores frecuentes.
- `/events` — Historial de 30 eventos simulados con búsqueda, filtros por riesgo y resultado, orden, paginación, detalle lateral y exportación CSV.
- `/events/:eventId` — Historial con el detalle del evento abierto en un panel lateral.
- `/rules` — Las nueve reglas de detección con sus pesos, búsqueda, filtros, activación individual y guía de umbrales.
- `/settings` — Protección, sensibilidad, alertas, preferencias generales, listas de dominios y restablecimiento de datos.

El pie del popup abre **Historial** y **Centro de control**; el engranaje superior abre **Configuración**. **Reglas de detección** forma parte del centro de control. El centro de escenarios no forma parte de la interfaz final.

### Pantallas de seguridad

- `/demo/warning` — Advertencia de riesgo medio, con confirmación para continuar.
- `/demo/blocked` — Bloqueo de riesgo alto, sin opción de continuar; incluye copia del informe o presentación manual si el portapapeles está restringido.

Ambas se abren en una pestaña nueva desde el centro de escenarios para revisar el viewport completo sin recortes ni vistas escaladas.

### Centro de escenarios

El centro permite revisar sin instalar nada:

- Los seis estados del popup: sin actividad, seguro, riesgo medio, riesgo alto, protección desactivada y análisis en curso.
- La advertencia y el bloqueo a tamaño completo, con acceso a su resumen, dominio, puntuación e indicadores.
- Una galería de componentes: estados de riesgo, medidores, indicadores, botones, etiquetas y controles interactivos.

El popup abre en “Sin actividad” cuando todavía no se ha analizado ninguna página y permite activar o pausar la protección desde su cabecera. El centro mantiene un único recorrido guiado por el popup, la advertencia y el bloqueo. La biblioteca de componentes queda como endpoint interno mediante `?tab=components`; no hay un enlace visible en el centro.

Los parámetros `tab` y `state` se sincronizan con la URL, por lo que se puede enlazar una vista concreta, por ejemplo:

```text
/?tab=popup&state=medium
```

La ruta anterior `/preview` redirige al centro de escenarios. Los enlaces antiguos con `layout=tabs` se ignoran y muestran el recorrido guiado.

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
  hooks/          Hooks compartidos, como el título del documento
  lib/            Utilidades de riesgo, formato, almacenamiento, portapapeles y clases
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
- El prototipo es exclusivamente de escritorio; por debajo de 1100 px se muestra un aviso y no se ofrece una experiencia móvil.
- El centro de escenarios forma parte de las herramientas de revisión y no de la interfaz final.
