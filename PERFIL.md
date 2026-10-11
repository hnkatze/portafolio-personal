# Perfil Profesional — Camilo Henriquez

> Documento de referencia personal. Última actualización: 2026-10-09.

## Datos personales

- **Nombre (marca/portafolio):** Camilo Henriquez
- **Nombre legal (certificaciones):** Hector Henriquez
- **Email (contacto portafolio):** contact@camilohenriquez.com
- **Email (personal):** henriquezhector1@hotmail.com
- **GitHub:** [hnkatze](https://github.com/hnkatze)
- **LinkedIn:** [linkedin.com/in/hnkatze](https://www.linkedin.com/in/hnkatze/)
- **Ubicación:** Remoto / Worldwide

## Resumen profesional

Desarrollador Full-Stack con 4+ años de experiencia. En el trabajo actual (CIT) el foco es frontend y mobile con Angular (v17–v21), Next.js, Astro, Lit Element y Flutter — incluyendo componentes nativos para iOS, construcción de soluciones de ML y MCP servers. En paralelo, como freelance, es responsable de la arquitectura full-stack en sistemas multi-frontend para clientes empresariales, aplicando ese mismo stack (Flutter + nativo iOS, ML, MCPs). Autor de MCP servers open source para integrar IA en flujos de desarrollo.

En 2026 sumó una línea de especialización en **datos, cloud e IA aplicada**: CDC, migración de datos (AWS DMS), consulta analítica serverless (Amazon Athena), RAG, y diseño de experiencias de agentes conversacionales sobre Amazon Connect (ACXD). Esto se combina con la construcción de MCP servers privados que exponen estas fuentes de datos como herramientas para asistentes de IA.

## Stack técnico

### Frontend
- React, Next.js, TypeScript (expert)
- Astro, Angular (v17–v21) (proficient)
- Tailwind CSS (expert)
- JavaScript, HTML & CSS (expert)
- Lit Element, Flutter (proficient)

### Backend
- NestJS (expert)
- PostgreSQL (proficient)
- Go, C# (familiar)

### Datos, Cloud & IA *(nuevo)*
- **CDC (Change Data Capture)** — captura de cambios incrementales sobre bases de datos para sincronización/streaming.
- **AWS DMS (Database Migration Service)** — migración y replicación de bases de datos; certificado en *Best Practices*.
- **Amazon Athena** — consultas analíticas serverless sobre datos (consumida desde MCP servers privados).
- **RAG (Retrieval-Augmented Generation)** — arquitecturas de recuperación + generación para IA contextual.
- **Amazon Connect + ACXD (Agentic CX Designer)** — diseño de experiencias de cliente agénticas sobre Connect ([ref. AWS docs](https://docs.aws.amazon.com/connect/latest/adminguide/acxd.html)).
- **Fundamentos de ML/IA (AWS)** — certificado en *Fundamentals of Machine Learning and Artificial Intelligence*.

### Tools & DevOps
- Git, Jest/Vitest, Playwright
- Docker, GitHub Actions (favorite)
- Firebase, Vercel/Railway
- AWS (familiar, en expansión activa hacia datos/IA)

## MCP Servers

### Públicos (open source)
- **Swagger Extractor MCP** (Go) — expone operaciones de Swagger Extractor como herramientas para IA. [repo](https://github.com/hnkatze/swagger-extractor-mcp)
- **PrimeNG MCP Server** (TypeScript) — documentación de componentes PrimeNG como herramientas MCP. [repo](https://github.com/hnkatze/PrimeNG_MCP)
- **context_shared_mcp** (TypeScript) — servidor MCP de "context board": permite buscar y publicar contexto compartido de equipo (conocimiento tribal, contratos implícitos) como herramientas para asistentes de IA. [repo](https://github.com/hnkatze/context_shared_mcp)
- **context_shared_admin** (Astro) — panel de administración del context board, para gestionar y visualizar el contexto compartido publicado. [repo](https://github.com/hnkatze/context_shared_admin)

### Privados
- MCP servers privados construidos para consumir **Amazon Athena** (consultas analíticas), **servicios de autenticación** y otras fuentes internas, exponiéndolas como herramientas para asistentes de IA en flujos de trabajo específicos de cliente/empresa.

## Experiencia

### Desarrollador Asociado — Creative Information Technologies (CIT)
**Julio 2024 — Presente**

Desarrollo frontend y mobile para proyectos enterprise de alto impacto. Stack: Angular (v17–v21), Next.js, Astro, Lit Element y Flutter. Proyectos bajo acuerdo de confidencialidad.

- Desarrollo web con Angular v17 a v21: signals, standalone components, deferrable views, OnPush en producción.
- Desarrollo mobile con Flutter + Dart, clean architecture y Riverpod, incluyendo componentes nativos para iOS.
- Construcción de soluciones de ML y MCP servers para integrar IA en flujos de trabajo del equipo.
- Trabajo con equipos multifuncionales, prácticas ágiles, code review estricto en TypeScript.
- Testing (unit + e2e) con Jest, Vitest y Playwright.

### Desarrollador Full-Stack Freelance
**2021 — Presente**

Soluciones web end-to-end para clientes internacionales: frontend (React, Next.js, Astro, Angular), backend (Node.js, NestJS) y despliegue. Trabajo remoto con clientes en distintas zonas horarias.

- Responsable de la arquitectura full-stack en proyectos multi-frontend para clientes empresariales (APIs REST con NestJS, PostgreSQL).
- Desarrollo mobile con Flutter, incluyendo componentes nativos para iOS; construcción de soluciones de ML y MCP servers para clientes.
- 25+ proyectos entregados con 100% de satisfacción del cliente: ONG, ecommerce, talleres de servicios y herramientas para desarrolladores.
- Pipelines CI/CD con GitHub Actions, Docker multi-stage y deploy en Railway, Vercel y Firebase.
- Autor de herramientas open source: Swagger Extractor MCP (Go), PrimeNG MCP Server (TypeScript), FetchMate (librería HTTP).

## Proyectos destacados

**Dev Tools & MCP**
- Swagger Extractor — herramienta web para specs OpenAPI/Swagger, export JSON/TOON para prompts LLM.
- Swagger Extractor MCP — servidor MCP en Go.
- PrimeNG MCP Server — documentación PrimeNG vía MCP.
- FetchMate — librería TypeScript de fetch con interceptors y retry.

**Clientes / Real-world**
- TacticBoard — pizarra táctica interactiva (Astro + Canvas API).
- Honduras Social Foundation — sitio de ONG con integración Every.org (Astro).
- Taller Gerardito — taller automotriz, reservas por WhatsApp (Astro).
- Taller Los Camilos — taller de soldadura/metalurgia (Astro).
- Scrunshes HN — landing social-commerce (Next.js).
- Portfolio — portafolio personal, Astro SSG con GSAP.

## Formación y cursos completados

> ⚠️ Son *completion certificates* de cursos/labs (AWS Training & Certification, AWS Skill Builder, Udemy, Platzi) — **no son certificaciones vendor-proctored** como AWS Certified Solutions Architect/Developer Associate. En CV/LinkedIn deben figurar como "formación completada", no como "AWS Certified".

| Curso / Lab | Emisor | Año |
|---|---|---|
| Getting Started with Amazon Connect — Customer Agentic CX Designer (ACXD) | AWS Training & Certification | 2026 (sep.) |
| Fundamentals of Machine Learning and Artificial Intelligence (Español LATAM) | AWS Training & Certification | 2026 (sep.) |
| AWS Database Migration Service — Best Practices (Practical) | AWS Training & Certification | 2026 (oct.) |
| Lab — Create a Static Website with Amazon S3 | AWS Training & Certification | 2025 (oct.) |
| AWS S3 | AWS Skill Builder | 2025 |
| Docker | Platzi | 2023 |
| Flutter | Udemy | 2024 |
| JavaScript | Udemy | 2022 |
| HTML & CSS | Udemy | 2022 |

### Certificados Anthropic (verificables)

A diferencia de los de AWS/Udemy/Platzi de arriba, estos tienen **link público de verificación** (Skilljar) — podés linkearlos directo en el CV/portafolio.

| Certificado | Emisor | Verificación |
|---|---|---|
| Introduction to Model Context Protocol | Anthropic | [verify.skilljar.com/c/2ts8j5y2udgu](https://verify.skilljar.com/c/2ts8j5y2udgu) |
| Claude with the Anthropic API | Anthropic | — |
| Introduction to Agent Skills | Anthropic | — |
| Claude Code in Action | Anthropic | [verify.skilljar.com/c/oc457ttu2nq4](https://verify.skilljar.com/c/oc457ttu2nq4) |

## Educación

- **Ingeniería en Informática** — CEUTEC (en curso). Software Engineering, Web Technologies, Data Structures.
- **Técnico Universitario Bilingüe en Call Center** — CEUTEC (completado). Customer Service, English Proficiency, Communication Skills.

## Idiomas

- Español — Nativo
- Inglés — Profesional
