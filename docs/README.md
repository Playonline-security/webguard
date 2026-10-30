# WebGuard

**Solución de ciberseguridad para fortalecer la protección durante la navegación web.**

## Descripción

WebGuard es un proyecto académico que propone el desarrollo de una solución orientada a apoyar la protección de usuarios de pequeñas y medianas empresas colombianas durante la navegación por Internet.

El proyecto contempla una solución compuesta por tres componentes principales:

- **Extensión de navegador:** analiza indicadores de riesgo mediante reglas y heurísticas, genera alertas y bloquea el acceso a páginas identificadas como peligrosas.
- **API:** centraliza la administración de configuraciones, procesa las solicitudes y recibe los eventos generados por la extensión.
- **Panel web:** permite consultar los eventos registrados y administrar las configuraciones del sistema.

La información de los eventos se almacena en una base de datos PostgreSQL.

## Tecnologías previstas

| Componente | Tecnologías |
|---|---|
| Extensión | TypeScript, WebExtensions API y Manifest V3 |
| Backend | Python y FastAPI |
| Base de datos | PostgreSQL |
| Panel web | React y TypeScript |

## Estructura del repositorio

```text
webguard/
├── docs/
│   └── formulacion/
├── README.md
└── ...
```

## Documentación

En la carpeta `docs/` se encuentra la documentación relacionada con la formulación, planificación, arquitectura y desarrollo del proyecto.

## Estado del proyecto

**Fase actual:** formulación y planificación del proyecto.

Las tecnologías y funcionalidades descritas corresponden a la propuesta inicial del producto mínimo viable (MVP) y podrán concretarse durante las siguientes etapas de desarrollo.

## Alcance

La primera versión de WebGuard estará orientada a navegadores de escritorio compatibles con Chrome y Firefox. Su mecanismo de detección se basará en reglas y heurísticas definidas por el equipo, por lo que no pretende sustituir soluciones especializadas de seguridad informática.
