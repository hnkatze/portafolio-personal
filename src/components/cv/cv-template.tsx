import type { CSSProperties } from 'react';
import type {
  PersonalInfo,
  Skill,
  Experience,
  Education,
  Certification,
  Language,
  Lang,
} from '@/lib/types';
import { t } from '@/lib/i18n';

// ── Style constants (mirrors Astro CVTemplate.astro) ────────────────────────
const paperStyle: CSSProperties = {
  width: '210mm',
  height: '297mm',
  padding: '10mm 12mm',
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: '8.5pt',
  lineHeight: 1.35,
  backgroundColor: '#ffffff',
  color: '#111827',
  overflow: 'hidden',
};

const sectionHeadingStyle: CSSProperties = {
  fontSize: '8pt',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '1.5px',
  marginBottom: '2mm',
  color: '#111827',
};

// ── Labels ───────────────────────────────────────────────────────────────────
const labels = {
  experience: { es: 'Experiencia Profesional', en: 'Professional Experience' },
  education:  { es: 'Educacion',               en: 'Education'               },
  skills:     { es: 'Habilidades Tecnicas',     en: 'Technical Skills'        },
  languages:  { es: 'Idiomas',                  en: 'Languages'               },
  frontend:   { es: 'Frontend',                 en: 'Frontend'                },
  backend:    { es: 'Backend',                  en: 'Backend'                 },
  devops:     { es: 'DevOps & Cloud',           en: 'DevOps & Cloud'          },
  present:    { es: 'Presente',                 en: 'Present'                 },
  inProgress: { es: 'En curso',                 en: 'In Progress'             },
  completed:  { es: 'Completado',               en: 'Completed'               },
  aiWorkflow: { es: 'Flujo de Trabajo con IA',  en: 'AI-Augmented Workflow'   },
  certifications: { es: 'Certificaciones',      en: 'Certifications'          },
  keyProjects:    { es: 'Proyectos Destacados', en: 'Key Projects'            },
} as const;

// ── Key projects (hardcoded — same as Astro source) ──────────────────────────
const keyProjects = [
  {
    name: 'Swagger Extractor MCP',
    desc: {
      es: 'Servidor MCP en Go para interaccion programatica de IA con specs OpenAPI',
      en: 'Go MCP server for programmatic AI interaction with OpenAPI specs',
    },
  },
  {
    name: 'PrimeNG MCP Server',
    desc: {
      es: 'Servidor MCP que expone documentacion de PrimeNG a asistentes de IA',
      en: 'MCP server exposing PrimeNG component docs to AI assistants',
    },
  },
  {
    name: 'Municipal Government Platform',
    desc: {
      es: 'Sistema integral: API NestJS 130+ endpoints, PostgreSQL + PostGIS, 5 frontends Angular/Astro',
      en: 'Full platform: NestJS API 130+ endpoints, PostgreSQL + PostGIS, 5 Angular/Astro frontends',
    },
  },
  {
    name: 'hondurassocial.org',
    desc: {
      es: 'Sitio web para ONG con integracion de donaciones (Every.org)',
      en: 'NGO website with donation integration (Every.org)',
    },
  },
] as const;

// ── Props ────────────────────────────────────────────────────────────────────
export interface CvTemplateProps {
  readonly personalInfo:   PersonalInfo;
  readonly skills:         Skill[];
  readonly experience:     Experience[];
  readonly education:      Education[];
  readonly certifications: Certification[];
  readonly languages:      Language[];
  readonly initialLang:    Lang;
}

// ── Component (RSC — no 'use client') ────────────────────────────────────────
export function CvTemplate({
  personalInfo,
  skills,
  experience,
  education,
  certifications,
  languages,
  initialLang,
}: CvTemplateProps) {
  const lang = initialLang;

  const frontendSkills = skills.filter((s) => s.category === 'frontend');
  const backendSkills  = skills.filter((s) => s.category === 'backend');
  const toolsSkills    = skills.filter((s) => s.category === 'tools');
  const testingSkills  = toolsSkills.filter((s) =>
    ['Git', 'Jest / Vitest', 'Playwright'].includes(s.name),
  );
  const devopsSkills = toolsSkills.filter(
    (s) => !['Git', 'Jest / Vitest', 'Playwright'].includes(s.name),
  );

  return (
    <div id="cv-paper" style={paperStyle}>
      {/* ── Header ── */}
      <header
        style={{
          textAlign: 'center',
          marginBottom: '4mm',
          paddingBottom: '3mm',
          borderBottom: '1.5px solid #e5e7eb',
        }}
      >
        <h1
          style={{
            fontSize: '18pt',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '1px',
          }}
        >
          {personalInfo.name}
        </h1>
        <p
          style={{
            fontSize: '10pt',
            color: '#2563eb',
            fontWeight: 500,
            marginBottom: '3px',
          }}
          data-i18n-en={t(personalInfo.title, 'en')}
          data-i18n-es={t(personalInfo.title, 'es')}
        >
          {t(personalInfo.title, lang)}
        </p>
        <p
          style={{
            fontSize: '7.5pt',
            color: '#6b7280',
            maxWidth: '450px',
            margin: '0 auto 4px',
            lineHeight: 1.4,
          }}
          data-i18n-en={t(personalInfo.summary, 'en')}
          data-i18n-es={t(personalInfo.summary, 'es')}
        >
          {t(personalInfo.summary, lang)}
        </p>
        <div
          style={{
            fontSize: '7.5pt',
            color: '#6b7280',
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            flexWrap: 'wrap',
          }}
        >
          <span>{personalInfo.email}</span>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span>{personalInfo.location}</span>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span>github.com/{personalInfo.socials.github}</span>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span>linkedin.com/in/hnkatze</span>
        </div>
      </header>

      {/* ── Two-column layout ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0 8mm',
        }}
      >
        {/* ── LEFT COLUMN: Experience + Key Projects + Education ── */}
        <div>
          {/* Experience */}
          <section style={{ marginBottom: '3.5mm' }}>
            <h2
              style={sectionHeadingStyle}
              data-i18n-en={t(labels.experience, 'en')}
              data-i18n-es={t(labels.experience, 'es')}
            >
              {t(labels.experience, lang)}
            </h2>
            {experience.map((exp, idx) => (
              <div
                key={`${exp.company}-${idx}`}
                style={{
                  marginBottom: idx < experience.length - 1 ? '3mm' : '0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{ fontWeight: 600, fontSize: '8.5pt', color: '#111827' }}
                    data-i18n-en={t(exp.role, 'en')}
                    data-i18n-es={t(exp.role, 'es')}
                  >
                    {t(exp.role, lang)}
                  </span>
                  <span style={{ fontSize: '7pt', color: '#9ca3af' }}>
                    {exp.startDate} —{' '}
                    {exp.endDate === 'Present'
                      ? t(labels.present, lang)
                      : exp.endDate}
                  </span>
                </div>
                <p style={{ fontSize: '7.5pt', color: '#2563eb', marginBottom: '1px' }}>
                  {exp.company}
                </p>
                <p
                  style={{ fontSize: '7.5pt', color: '#4b5563', marginBottom: '1.5px' }}
                  data-i18n-en={t(exp.description, 'en')}
                  data-i18n-es={t(exp.description, 'es')}
                >
                  {t(exp.description, lang)}
                </p>
                <ul style={{ margin: 0, paddingLeft: '12px' }}>
                  {exp.highlights.map((h, hIdx) => (
                    <li
                      key={hIdx}
                      style={{ fontSize: '7.5pt', color: '#6b7280', marginBottom: '0.5px' }}
                      data-i18n-en={t(h, 'en')}
                      data-i18n-es={t(h, 'es')}
                    >
                      {t(h, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Key Projects */}
          <section style={{ marginBottom: '3.5mm' }}>
            <h2
              style={sectionHeadingStyle}
              data-i18n-en={t(labels.keyProjects, 'en')}
              data-i18n-es={t(labels.keyProjects, 'es')}
            >
              {t(labels.keyProjects, lang)}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>
              {keyProjects.map((p) => (
                <div key={p.name}>
                  <span style={{ fontWeight: 600, fontSize: '7.5pt', color: '#111827' }}>
                    {p.name}
                  </span>
                  <span
                    style={{ fontSize: '7.5pt', color: '#6b7280' }}
                    data-i18n-en={` — ${t(p.desc, 'en')}`}
                    data-i18n-es={` — ${t(p.desc, 'es')}`}
                  >
                    {` — ${t(p.desc, lang)}`}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2
              style={sectionHeadingStyle}
              data-i18n-en={t(labels.education, 'en')}
              data-i18n-es={t(labels.education, 'es')}
            >
              {t(labels.education, lang)}
            </h2>
            {education.map((edu, idx) => (
              <div
                key={`${edu.institution}-${idx}`}
                style={{ marginBottom: idx < education.length - 1 ? '2mm' : '0' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    style={{ fontWeight: 600, fontSize: '8.5pt', color: '#111827' }}
                    data-i18n-en={t(edu.degree, 'en')}
                    data-i18n-es={t(edu.degree, 'es')}
                  >
                    {t(edu.degree, lang)}
                  </span>
                  <span
                    style={{
                      fontSize: '6.5pt',
                      padding: '0.5px 4px',
                      borderRadius: '9999px',
                      backgroundColor:
                        edu.status === 'in_progress' ? '#dbeafe' : '#f3f4f6',
                      color:
                        edu.status === 'in_progress' ? '#2563eb' : '#6b7280',
                    }}
                    data-i18n-en={
                      edu.status === 'in_progress'
                        ? t(labels.inProgress, 'en')
                        : t(labels.completed, 'en')
                    }
                    data-i18n-es={
                      edu.status === 'in_progress'
                        ? t(labels.inProgress, 'es')
                        : t(labels.completed, 'es')
                    }
                  >
                    {edu.status === 'in_progress'
                      ? t(labels.inProgress, lang)
                      : t(labels.completed, lang)}
                  </span>
                </div>
                <p style={{ fontSize: '7.5pt', color: '#2563eb' }}>
                  {edu.institution}
                </p>
                {edu.highlights && (
                  <p style={{ fontSize: '7pt', color: '#6b7280', marginTop: '0.5px' }}>
                    {edu.highlights.join(' · ')}
                  </p>
                )}
              </div>
            ))}
          </section>
        </div>

        {/* ── RIGHT COLUMN: Skills + AI Workflow + Languages + Certifications ── */}
        <div>
          {/* Skills */}
          <section style={{ marginBottom: '3.5mm' }}>
            <h2
              style={sectionHeadingStyle}
              data-i18n-en={t(labels.skills, 'en')}
              data-i18n-es={t(labels.skills, 'es')}
            >
              {t(labels.skills, lang)}
            </h2>

            {/* Frontend */}
            <div style={{ marginBottom: '2mm' }}>
              <h3
                style={{
                  fontSize: '7pt',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  marginBottom: '1.5mm',
                }}
              >
                {t(labels.frontend, lang)}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                {frontendSkills.map((s) => (
                  <span
                    key={s.name}
                    style={{
                      fontSize: '7pt',
                      padding: '0.5px 4px',
                      borderRadius: '2px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      border: '0.5px solid #dbeafe',
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend + Testing */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2mm',
                marginBottom: '2mm',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '7pt',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    marginBottom: '1.5mm',
                  }}
                >
                  {t(labels.backend, lang)}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                  {backendSkills.map((s) => (
                    <span
                      key={s.name}
                      style={{
                        fontSize: '7pt',
                        padding: '0.5px 4px',
                        borderRadius: '2px',
                        backgroundColor: '#f0fdf4',
                        color: '#15803d',
                        border: '0.5px solid #dcfce7',
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '7pt',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    marginBottom: '1.5mm',
                  }}
                >
                  Testing
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                  {testingSkills.map((s) => (
                    <span
                      key={s.name}
                      style={{
                        fontSize: '7pt',
                        padding: '0.5px 4px',
                        borderRadius: '2px',
                        backgroundColor: '#faf5ff',
                        color: '#7e22ce',
                        border: '0.5px solid #f3e8ff',
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* DevOps */}
            <div>
              <h3
                style={{
                  fontSize: '7pt',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  marginBottom: '1.5mm',
                }}
                data-i18n-en={t(labels.devops, 'en')}
                data-i18n-es={t(labels.devops, 'es')}
              >
                {t(labels.devops, lang)}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                {devopsSkills.map((s) => (
                  <span
                    key={s.name}
                    style={{
                      fontSize: '7pt',
                      padding: '0.5px 4px',
                      borderRadius: '2px',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      border: '0.5px solid #fde68a',
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* AI Workflow */}
          <section style={{ marginBottom: '3.5mm' }}>
            <h2
              style={sectionHeadingStyle}
              data-i18n-en={t(labels.aiWorkflow, 'en')}
              data-i18n-es={t(labels.aiWorkflow, 'es')}
            >
              {t(labels.aiWorkflow, lang)}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>
              <div>
                <span
                  style={{ fontSize: '7.5pt', fontWeight: 600, color: '#111827' }}
                  data-i18n-en="AI Assistants: "
                  data-i18n-es="Asistentes IA: "
                >
                  {lang === 'es' ? 'Asistentes IA: ' : 'AI Assistants: '}
                </span>
                <span
                  style={{ fontSize: '7.5pt', color: '#6b7280' }}
                  data-i18n-en="Claude Code, GitHub Copilot, Gemini, Codex — generation, refactoring, pair programming"
                  data-i18n-es="Claude Code, GitHub Copilot, Gemini, Codex — generacion, refactoring, pair programming"
                >
                  {lang === 'es'
                    ? 'Claude Code, GitHub Copilot, Gemini, Codex — generacion, refactoring, pair programming'
                    : 'Claude Code, GitHub Copilot, Gemini, Codex — generation, refactoring, pair programming'}
                </span>
              </div>
              <div>
                <span
                  style={{ fontSize: '7.5pt', fontWeight: 600, color: '#111827' }}
                >
                  MCP Servers:{' '}
                </span>
                <span
                  style={{ fontSize: '7.5pt', color: '#6b7280' }}
                  data-i18n-en="Author of 3 open source MCP servers (Go, TypeScript) for OpenAPI and component docs"
                  data-i18n-es="Autor de 3 servidores MCP open source (Go, TypeScript) para OpenAPI y docs de componentes"
                >
                  {lang === 'es'
                    ? 'Autor de 3 servidores MCP open source (Go, TypeScript) para OpenAPI y docs de componentes'
                    : 'Author of 3 open source MCP servers (Go, TypeScript) for OpenAPI and component docs'}
                </span>
              </div>
              <div>
                <span
                  style={{ fontSize: '7.5pt', fontWeight: 600, color: '#111827' }}
                  data-i18n-en="Platforms: "
                  data-i18n-es="Plataformas: "
                >
                  {lang === 'es' ? 'Plataformas: ' : 'Platforms: '}
                </span>
                <span style={{ fontSize: '7.5pt', color: '#6b7280' }}>
                  DigitalOcean, Railway, Render, Vercel, Netlify, Firebase
                </span>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section style={{ marginBottom: '3.5mm' }}>
            <h2
              style={sectionHeadingStyle}
              data-i18n-en={t(labels.languages, 'en')}
              data-i18n-es={t(labels.languages, 'es')}
            >
              {t(labels.languages, lang)}
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              {languages.map((l, idx) => (
                <div key={idx}>
                  <span
                    style={{ fontWeight: 500, color: '#111827', fontSize: '8pt' }}
                    data-i18n-en={t(l.name, 'en')}
                    data-i18n-es={t(l.name, 'es')}
                  >
                    {t(l.name, lang)}
                  </span>
                  <span
                    style={{ color: '#6b7280', fontSize: '8pt' }}
                    data-i18n-en={` — ${t(l.level, 'en')}`}
                    data-i18n-es={` — ${t(l.level, 'es')}`}
                  >
                    {' '}— {t(l.level, lang)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <h2
              style={sectionHeadingStyle}
              data-i18n-en={t(labels.certifications, 'en')}
              data-i18n-es={t(labels.certifications, 'es')}
            >
              {t(labels.certifications, lang)}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
              {certifications.map((cert) => (
                <div
                  key={`${cert.name}-${cert.year}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontSize: '7.5pt', color: '#111827' }}>
                    {cert.name}
                  </span>
                  <span style={{ fontSize: '7pt', color: '#9ca3af' }}>
                    {cert.issuer} · {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
