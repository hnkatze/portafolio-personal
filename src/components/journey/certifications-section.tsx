import type { BilingualText, Education, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import { I18nSplitWords, Reveal } from '@/components/animations';

/* ============================================================
   Certifications Section — Swiss Editorial "Certificaciones"
   dossier (T-07). Server component, new section (did not exist
   before this redesign). Same breadcrumb/headline skeleton as
   Skills/Experience/Projects (T-04..T-06).

   Reference: Stitch screen 81033d9d07d3496296e6dd282586e08c
   ("Certificaciones — Interactive Studio Edition") for the
   breadcrumb + 3-sector dossier structure only. Dropped from the
   mock: invented per-cert curriculum blurbs, invented "Modalidad"
   badges on the training table, and the Idiomas matrix (none of
   it is confirmed in PERFIL.md and the section's whole point is
   honesty about what is/isn't verifiable — same criterion T-04/
   T-05/T-06 used for unverifiable metrics).

   Content, verbatim from PERFIL.md ("Certificados Anthropic
   (verificables)" and "Formación y cursos completados") plus
   `education` from data.ts (the real structured source for that
   part, not PERFIL.md). Accent: cobalt — the design tokens
   reserve cobalt for MCP/certifications, so this section (and
   its Anthropic/MCP-adjacent group especially) uses cobalt as
   its primary accent instead of vermilion.
   ============================================================ */

interface CertificationsSectionProps {
  readonly education: Education[];
  readonly lang: Lang;
}

export interface AnthropicCert {
  readonly ref: string;
  readonly title: string;
  readonly verifyUrl?: string;
}

// Verbatim from PERFIL.md "Certificados Anthropic (verificables)" — only
// Introduction to MCP and Claude Code in Action have a public Skilljar
// link; the other two are left without one, per the task's instruction
// to never invent a verification link that doesn't exist in the source.
export const ANTHROPIC_CERTS: readonly AnthropicCert[] = [
  {
    ref: 'ANTH-01 // MCP',
    title: 'Introduction to Model Context Protocol',
    verifyUrl: 'https://verify.skilljar.com/c/2ts8j5y2udgu',
  },
  {
    ref: 'ANTH-02 // API',
    title: 'Claude with the Anthropic API',
  },
  {
    ref: 'ANTH-03 // SKILLS',
    title: 'Introduction to Agent Skills',
  },
  {
    ref: 'ANTH-04 // CLI',
    title: 'Claude Code in Action',
    verifyUrl: 'https://verify.skilljar.com/c/oc457ttu2nq4',
  },
];

export interface TrainingRow {
  readonly course: string;
  readonly issuer: string;
  readonly year: string;
}

// Verbatim from PERFIL.md "Formación y cursos completados" table, same
// order. No invented subtitle/modality column — PERFIL.md's table only
// has course, issuer, and year.
export const TRAINING: readonly TrainingRow[] = [
  {
    course: 'Getting Started with Amazon Connect — Customer Agentic CX Designer (ACXD)',
    issuer: 'AWS Training & Certification',
    year: '2026 (sep.)',
  },
  {
    course: 'Fundamentals of Machine Learning and Artificial Intelligence (Español LATAM)',
    issuer: 'AWS Training & Certification',
    year: '2026 (sep.)',
  },
  {
    course: 'AWS Database Migration Service — Best Practices (Practical)',
    issuer: 'AWS Training & Certification',
    year: '2026 (oct.)',
  },
  {
    course: 'Lab — Create a Static Website with Amazon S3',
    issuer: 'AWS Training & Certification',
    year: '2025 (oct.)',
  },
  { course: 'AWS S3', issuer: 'AWS Skill Builder', year: '2025' },
  { course: 'Docker', issuer: 'Platzi', year: '2023' },
  { course: 'Flutter', issuer: 'Udemy', year: '2024' },
  { course: 'JavaScript', issuer: 'Udemy', year: '2022' },
  { course: 'HTML & CSS', issuer: 'Udemy', year: '2022' },
];

const STATUS_LABEL: Record<Education['status'], BilingualText> = {
  completed: { es: 'COMPLETADO', en: 'COMPLETED' },
  in_progress: { es: 'EN CURSO', en: 'IN PROGRESS' },
};

const WARNING: BilingualText = {
  es: 'Son completion certificates de cursos y laboratorios (AWS Training & Certification, AWS Skill Builder, Udemy, Platzi) — no son certificaciones vendor-proctored como AWS Certified Solutions Architect/Developer Associate. En CV y portafolio figuran como formación completada, nunca como "AWS Certified".',
  en: 'These are completion certificates for courses and labs (AWS Training & Certification, AWS Skill Builder, Udemy, Platzi) — not vendor-proctored certifications like AWS Certified Solutions Architect/Developer Associate. On this CV and portfolio they are listed as completed training, never as "AWS Certified".',
};

const ANTHROPIC_NOTE: BilingualText = {
  es: 'A diferencia de la formación anterior, estos certificados de Anthropic tienen link público de verificación vía Skilljar — se pueden comprobar directamente.',
  en: 'Unlike the training above, these Anthropic certificates carry a public Skilljar verification link — they can be checked directly.',
};

export function CertificationsSection({
  education,
  lang,
}: CertificationsSectionProps) {
  const leadEn =
    'A rigorous record of verifiable technical credentials, cloud labs, and formal academic background.';
  const leadEs =
    'Registro riguroso de credenciales técnicas verificables, laboratorios de nube y trayectoria académica formal.';

  return (
    <section id="certifications" className="relative bg-canvas-base">
      {/* Dossier breadcrumb bar — mirrors Skills/Experience/Projects "0N /" pattern */}
      <header className="flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline px-[var(--shell-padding-x)] py-xs">
        <div className="flex items-center gap-md">
          <span className="text-label-index font-semibold text-accent-cobalt">
            08 /
          </span>
          <span
            className="text-label-index uppercase tracking-widest text-text-primary"
          >
            {lang === 'en' ? 'CERTIFICATIONS' : 'CERTIFICACIONES'}
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span
            className="inline-block h-1.5 w-1.5 bg-status-success"
            aria-hidden="true"
          />
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
          >
            {lang === 'en' ? 'PUBLIC RECORDS' : 'REGISTROS PÚBLICOS'}
          </span>
        </div>
      </header>

      {/* Headline + lead */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <h2 className="text-headline-xl text-text-primary">
          <I18nSplitWords
            textEn="Certifications."
            textEs="Certificaciones."
          />
        </h2>
        <Reveal direction="up" delay={0.15} duration={0.6} className="mt-sm">
          <p className="max-w-[42rem] text-body-lead text-text-secondary" >
            {lang === 'en' ? leadEn : leadEs}
          </p>
        </Reveal>
      </div>

      {/* Sector 01 — Certificados Anthropic (verificables) */}
      <Reveal direction="up" duration={0.5} amount={0.1}>
        <div className="border-y border-border-hairline bg-canvas-subtle px-[var(--shell-padding-x)] py-2xl">
          <div className="grid grid-cols-1 gap-xl lg:grid-cols-12 lg:gap-[var(--shell-gutter)]">
            {/* Index column */}
            <div className="flex flex-col gap-lg border-b border-border-hairline pb-lg lg:col-span-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-xl">
              <div>
                <span className="text-label-index uppercase tracking-widest text-text-muted">
                  01 / ANTHROPIC TRACK
                </span>
                <h3 className="mt-2xs text-headline-lg text-text-primary" >
                  {lang === 'en'
                    ? 'Anthropic certificates'
                    : 'Certificados Anthropic'}
                </h3>
                <span
                  className="mt-xs inline-block border border-accent-cobalt/30 bg-accent-cobalt-subtle px-xs py-2xs text-label-mono text-accent-cobalt"
                >
                  {lang === 'en'
                    ? 'PUBLICLY VERIFIABLE'
                    : 'VERIFICABLES PÚBLICAMENTE'}
                </span>
              </div>

              <div className="flex flex-col gap-xs border border-border-hairline bg-canvas-base p-md">
                <span
                  className="text-label-mono uppercase tracking-wider text-text-secondary"
                >
                  {lang === 'en' ? 'Editorial note' : 'Anotación editorial'}
                </span>
                <p
                  className="text-body-sm leading-relaxed text-text-secondary"
                >
                  {t(ANTHROPIC_NOTE, lang)}
                </p>
              </div>
            </div>

            {/* Content cards matrix */}
            <div className="grid grid-cols-1 gap-px border border-border-hairline bg-border-hairline md:grid-cols-2 lg:col-span-8">
              {ANTHROPIC_CERTS.map((cert) => (
                <div
                  key={cert.ref}
                  className="group flex flex-col justify-between bg-canvas-base p-lg transition-colors hover:bg-canvas-subtle"
                >
                  <div>
                    <div className="mb-sm flex items-center justify-between text-label-index text-text-muted">
                      <span>{cert.ref}</span>
                      {cert.verifyUrl ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-status-success">
                          <span
                            className="inline-block h-1.5 w-1.5 bg-status-success"
                            aria-hidden="true"
                          />
                          <span>
                            {lang === 'en' ? 'VERIFIABLE' : 'VERIFICABLE'}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-text-secondary">
                          <span
                            className="inline-block h-1.5 w-1.5 bg-text-muted"
                            aria-hidden="true"
                          />
                          <span >
                            {lang === 'en'
                              ? 'OFFICIAL CERTIFICATE'
                              : 'CERTIFICADO OFICIAL'}
                          </span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-headline-md text-text-primary">
                      {cert.title}
                    </h4>
                    <span
                      className="mt-sm inline-block border border-border-hairline bg-canvas-subtle px-xs py-2xs text-label-index text-text-muted"
                    >
                      {lang === 'en' ? 'ISSUER: ANTHROPIC' : 'EMISOR: ANTHROPIC'}
                    </span>
                  </div>

                  <div className="mt-md flex items-center justify-between border-t border-border-hairline pt-md">
                    {cert.verifyUrl ? (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label-mono inline-flex items-center gap-1.5 uppercase tracking-wider text-text-primary transition-colors hover:text-accent-cobalt"
                        aria-label={`Verify ${cert.title} credential`}
                      >
                        <span >
                          {lang === 'en'
                            ? 'VERIFY CREDENTIAL'
                            : 'VERIFICAR CREDENCIAL'}
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="text-label-mono text-text-muted" >
                        {lang === 'en'
                          ? 'NO PUBLIC LINK'
                          : 'SIN LINK PÚBLICO'}
                      </span>
                    )}
                    <span className="text-label-index text-text-muted" >
                      {lang === 'en' ? 'DIRECT COURSE' : 'CURSO DIRECTO'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Sector 02 — Formación y cursos completados */}
      <Reveal direction="up" duration={0.5} amount={0.1}>
        <div className="border-b border-border-hairline px-[var(--shell-padding-x)] py-2xl">
          <div className="grid grid-cols-1 gap-xl lg:grid-cols-12 lg:gap-[var(--shell-gutter)]">
            <div className="lg:col-span-4">
              <span className="text-label-index uppercase tracking-widest text-text-muted">
                02 / LABS &amp; COMPLETION
              </span>
              <h3 className="mt-2xs text-headline-lg text-text-primary" >
                {lang === 'en'
                  ? 'Completed training & courses'
                  : 'Formación y cursos completados'}
              </h3>
            </div>

            {/* Explicit transparency callout — verbatim from PERFIL.md, not omitted or softened */}
            <div className="border-l-2 border-status-warning bg-canvas-subtle p-md lg:col-span-8">
              <span
                className="text-label-mono uppercase tracking-wider text-status-warning"
              >
                {lang === 'en'
                  ? 'Professional transparency note'
                  : 'Nota de transparencia profesional'}
              </span>
              <p
                className="mt-xs text-body-sm leading-relaxed text-text-secondary"
              >
                {t(WARNING, lang)}
              </p>
            </div>
          </div>

          {/* Training table */}
          <div className="mt-xl overflow-x-auto border border-border-hairline">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border-hairline bg-canvas-subtle text-label-index uppercase tracking-wider text-text-muted">
                  <th scope="col" className="w-16 px-md py-sm">
                    #
                  </th>
                  <th scope="col" className="px-md py-sm">
                    <span>
                      {lang === 'en' ? 'Course / Lab' : 'Curso / Lab'}
                    </span>
                  </th>
                  <th scope="col" className="px-md py-sm">
                    <span>
                      {lang === 'en' ? 'Issuer' : 'Emisor'}
                    </span>
                  </th>
                  <th scope="col" className="px-md py-sm text-right">
                    <span>
                      {lang === 'en' ? 'Year' : 'Año'}
                    </span>
                  </th>
                </tr>
              </thead>
              {/* No `.text-label-mono`/`.text-label-index` on <tbody> or <tr> —
                  both force text-transform: uppercase onto children, which
                  would wreck identity content (course names, issuer names)
                  the same way T-04's skill-name gotcha did. Index/year are
                  metadata (mono font, no forced case needed since they're
                  numeric); course/issuer are identity content (plain body
                  font, real casing preserved). */}
              <tbody className="divide-y divide-border-hairline">
                {TRAINING.map((row, i) => (
                  <tr key={row.course} className="group transition-colors hover:bg-canvas-subtle">
                    <td className="px-md py-sm font-mono text-[12px] text-text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="px-md py-sm text-body-sm text-text-primary">
                      {row.course}
                    </td>
                    <td className="px-md py-sm text-body-sm text-text-secondary">
                      {row.issuer}
                    </td>
                    <td className="px-md py-sm text-right font-mono text-[12px] tracking-wide text-text-secondary">
                      {row.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Sector 03 — Educación (src/lib/data.ts `education`, not PERFIL.md) */}
      <Reveal direction="up" duration={0.5} amount={0.1}>
        <div className="px-[var(--shell-padding-x)] py-2xl">
          <div className="grid grid-cols-1 gap-xl lg:grid-cols-12 lg:gap-[var(--shell-gutter)]">
            <div className="flex flex-col gap-md border-b border-border-hairline pb-lg lg:col-span-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-xl">
              <div>
                <span className="text-label-index uppercase tracking-widest text-text-muted">
                  03 / ACADEMIC
                </span>
                <h3 className="mt-2xs text-headline-lg text-text-primary" >
                  {lang === 'en' ? 'Formal education' : 'Educación formal'}
                </h3>
              </div>
              <div className="flex flex-col gap-xs border border-border-hairline bg-canvas-subtle p-md">
                <span
                  className="text-label-index uppercase tracking-widest text-text-muted"
                >
                  {lang === 'en' ? 'HOST INSTITUTION' : 'FACULTAD MATRIZ'}
                </span>
                <p className="text-headline-md text-text-primary">CEUTEC</p>
              </div>
            </div>

            <div className="flex flex-col gap-lg lg:col-span-8">
              {education.map((edu) => (
                <div
                  key={edu.institution + t(edu.degree, 'en')}
                  className="border border-border-hairline p-lg"
                >
                  <div className="flex flex-col gap-xs border-b border-border-hairline pb-md md:flex-row md:items-baseline md:justify-between">
                    <h4 className="text-headline-lg text-text-primary" >
                      {t(edu.degree, lang)}
                    </h4>
                    <span className="flex items-baseline gap-2xs text-label-mono text-text-muted">
                      <span>
                        {lang === 'en' ? 'STATUS:' : 'ESTADO:'}
                      </span>
                      <span
                        className={`font-semibold ${
                          edu.status === 'completed'
                            ? 'text-status-success'
                            : 'text-text-primary'
                        }`}
                      >
                        {t(STATUS_LABEL[edu.status], lang)}
                      </span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-md pt-md md:grid-cols-12">
                    <div className="flex items-baseline gap-2xs text-label-mono text-text-muted md:col-span-4">
                      <span>
                        {lang === 'en' ? 'INSTITUTION:' : 'INSTITUCIÓN:'}
                      </span>
                      <span className="text-text-primary">
                        {edu.institution}
                      </span>
                    </div>
                    {edu.highlights && edu.highlights.length > 0 && (
                      <div className="md:col-span-8">
                        <span
                          className="mb-xs block text-label-index uppercase tracking-widest text-text-muted"
                        >
                          {lang === 'en' ? 'FOCUS AREAS' : 'ÁREAS DE ENFOQUE'}
                        </span>
                        <div className="flex flex-wrap gap-xs">
                          {edu.highlights.map((item) => (
                            <span
                              key={item}
                              className="border border-border-hairline bg-canvas-subtle px-sm py-2xs text-body-sm text-text-primary"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="divider-hairline" />
    </section>
  );
}
