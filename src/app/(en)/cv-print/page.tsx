import { Suspense } from 'react';
import type { Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import {
  personalInfo,
  skills,
  experience,
  projects,
  education,
  languages,
} from '@/lib/data';
import {
  LEVEL_LABEL,
  DATA_CLOUD_META,
  DATA_CLOUD_ITEMS,
} from '@/components/journey/skills-section';
import { ANTHROPIC_CERTS, TRAINING } from '@/components/journey/certifications-section';

/* ============================================================
   /cv-print — printable CV, exported to PDF by scripts/generate-cv-pdf.ts
   (T-11..T-14). Server component, no client interactivity, no
   scroll-triggered animation primitives (Reveal/SplitWords stay at
   opacity:0 until scrolled into view — meaningless in a headless
   PDF capture, so this page renders everything at full opacity
   directly).

   Source of truth: the exact same `src/lib/data.ts` the live site
   uses, PLUS the "Datos, Cloud & IA" skill quadrant and the
   Anthropic/Formación certification lists — both already exist as
   real content inside skills-section.tsx / certifications-section.tsx
   (not in data.ts, by explicit earlier decision not to add a new
   data.ts array for them) and are imported here via `export`
   instead of re-typed, so there is exactly one copy of that content
   in the repo.

   Deliberately NOT included: the "native iOS in Flutter / ML / MCP"
   phrasing for the CIT role that PERFIL.md has but `experience[0]
   .highlights` in data.ts does not — a prior session explicitly
   decided to keep that addition PERFIL.md-only and not touch
   data.ts/the public site. This CV reads only from data.ts, so it
   stays consistent with that decision and with the live Experience
   section. If that's no longer the right call, it's a new ask.

   Lang comes from `?lang=en|es` (not cookies) because the export
   script hits this URL directly with Playwright, outside any
   browser session/cookie.

   Print-only light theme: CVs/ATS parsers expect light backgrounds,
   unlike the rest of this (dark) site. Swiss typography/hairline
   language is kept, just inverted. Page chrome (ScrollProgress/
   EditorialHeader/SectionNav, injected by the root layout for every
   route) is hidden via `print:hidden` in layout.tsx, not duplicated
   here.
   ============================================================ */

export const metadata = {
  title: 'CV — Camilo Henriquez',
  robots: { index: false, follow: false },
};

interface CvPrintPageProps {
  readonly searchParams: Promise<{ lang?: string }>;
}

// Reading `searchParams` is a dynamic API under Cache Components — it must be
// isolated behind a Suspense boundary or the whole route is flagged as a
// blocking/uncached route at build time. Same shape as page.tsx's own
// LangBoundary/Suspense pattern for cookie-based lang resolution.
export default function CvPrintPage(props: CvPrintPageProps) {
  return (
    <Suspense fallback={null}>
      <CvPrintContent {...props} />
    </Suspense>
  );
}

const KNOWN_DEV_TOOL_TITLES = new Set([
  'Swagger Extractor',
  'Swagger Extractor MCP',
  'PrimeNG MCP Server',
  'FetchMate',
]);

// Editorial judgment call (documented in odd/tasks/stitch-swiss-editorial-redesign.md
// T-11): all 10 real projects don't fit one legible A4 page alongside everything
// else that was missing (full skills matrix, all certifications, both experience
// entries). Keep all 4 Dev Tools & MCP entries (the clearest differentiator), plus
// 3 client projects chosen for breadth across the "ONGs, e-commerce, talleres de
// servicios" claim already made in the freelance experience highlight — NOT cut
// for being less real, just for one-page space.
const FEATURED_CLIENT_TITLES = new Set([
  'Honduras Social Foundation',
  'Taller Gerardito',
  'Taller Los Camilos',
]);

async function CvPrintContent({ searchParams }: CvPrintPageProps) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'en' ? 'en' : params.lang === 'es' ? 'es' : 'en';

  const devTools = projects.filter((p) => KNOWN_DEV_TOOL_TITLES.has(p.title));
  const clients = projects.filter((p) => FEATURED_CLIENT_TITLES.has(p.title));

  const frontend = skills.filter((s) => s.category === 'frontend');
  const backend = skills.filter((s) => s.category === 'backend');
  const tools = skills.filter((s) => s.category === 'tools');

  const L = {
    skillsTitle: lang === 'en' ? 'Technical Skills' : 'Habilidades Técnicas',
    frontend: lang === 'en' ? 'Frontend' : 'Frontend',
    backend: lang === 'en' ? 'Backend' : 'Backend',
    dataCloud: t(DATA_CLOUD_META.title, lang),
    tools: lang === 'en' ? 'Tools & DevOps' : 'Tools & DevOps',
    experience: lang === 'en' ? 'Professional Experience' : 'Experiencia Profesional',
    projects: lang === 'en' ? 'Featured Projects' : 'Proyectos Destacados',
    devToolsGroup: lang === 'en' ? 'Dev Tools & MCP' : 'Dev Tools & MCP',
    clientsGroup: lang === 'en' ? 'Clients / Real-World' : 'Clientes / Real-World',
    education: lang === 'en' ? 'Education' : 'Educación',
    languages: lang === 'en' ? 'Languages' : 'Idiomas',
    certifications: lang === 'en' ? 'Certifications & Training' : 'Certificaciones y Formación',
    anthropic: lang === 'en' ? 'Anthropic (verified)' : 'Anthropic (verificados)',
    training: lang === 'en' ? 'Training & labs' : 'Formación y labs',
    present: lang === 'en' ? 'Present' : 'Presente',
    basedIn: lang === 'en' ? 'Based in' : 'Ubicación',
    remote: lang === 'en' ? 'Working remote · Worldwide' : 'Trabajo remoto · A nivel mundial',
    completed: lang === 'en' ? 'Completed' : 'Completado',
    inProgress: lang === 'en' ? 'In progress' : 'En curso',
  };

  return (
    <main
      className="mx-auto bg-white text-[#18181b]"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 9mm',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Header */}
      <header className="border-b-2 border-[#18181b] pb-3">
        <h1
          className="font-bold leading-none"
          style={{ fontFamily: 'var(--font-display)', fontSize: '26px' }}
        >
          {personalInfo.name}
        </h1>
        <p className="mt-1 text-[13px] font-semibold text-[#e63926]">
          {t(personalInfo.title, lang)}
        </p>
        <p className="mt-1.5 text-[9.5px] text-[#52525b]">
          {personalInfo.email} · San Pedro Sula, Honduras · {L.remote} ·
          camilohenriquez.com · github.com/{personalInfo.socials.github} ·
          linkedin.com/in/hnkatze
        </p>
        <p className="mt-2 text-[10.5px] leading-snug text-[#27272a]">
          {t(personalInfo.summary, lang)}
        </p>
      </header>

      {/* Two-column body */}
      <div className="mt-3 grid grid-cols-12 gap-4">
        {/* Left sidebar */}
        <div className="col-span-4 flex flex-col gap-3">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#18181b]">
              {L.skillsTitle}
            </h2>
            <SkillGroup label={L.frontend} items={frontend} lang={lang} />
            <SkillGroup label={L.backend} items={backend} lang={lang} />
            <div className="mt-1.5">
              <p className="text-[8.5px] font-bold uppercase tracking-wide text-[#2d68ff]">
                {L.dataCloud}
              </p>
              <ul className="mt-0.5 flex flex-col gap-0.5">
                {DATA_CLOUD_ITEMS.map((item) => (
                  <li key={item.name} className="text-[9px] leading-tight text-[#27272a]">
                    <span className="font-semibold">{item.name}</span>
                    {' — '}
                    <span className="text-[#52525b]">{t(item.badge, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <SkillGroup label={L.tools} items={tools} lang={lang} />
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#18181b]">
              {L.certifications}
            </h2>
            <p className="mt-1 text-[8.5px] font-bold uppercase tracking-wide text-[#2d68ff]">
              {L.anthropic}
            </p>
            <ul className="mt-0.5 flex flex-col gap-0.5">
              {ANTHROPIC_CERTS.map((cert) => (
                <li key={cert.ref} className="text-[9px] leading-tight text-[#27272a]">
                  {cert.title}
                  {cert.verifyUrl && (
                    <span className="text-[#2d68ff]">
                      {' '}
                      ↗ {lang === 'en' ? 'verified' : 'verificado'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-[8.5px] font-bold uppercase tracking-wide text-[#52525b]">
              {L.training}
            </p>
            <ul className="mt-0.5 flex flex-col gap-0.5">
              {TRAINING.map((row) => (
                <li key={row.course} className="text-[8.5px] leading-tight text-[#27272a]">
                  <span className="font-medium">{row.course}</span>
                  <span className="text-[#71717a]">
                    {' '}
                    — {row.issuer}, {row.year}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#18181b]">
              {L.education}
            </h2>
            {education.map((edu) => (
              <div key={edu.institution + edu.degree.en} className="mt-1">
                <p className="text-[9.5px] font-semibold text-[#18181b]">
                  {t(edu.degree, lang)}
                </p>
                <p className="text-[8.5px] text-[#52525b]">
                  {edu.institution} ·{' '}
                  {edu.status === 'completed' ? L.completed : L.inProgress}
                </p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#18181b]">
              {L.languages}
            </h2>
            <ul className="mt-1 flex flex-col gap-0.5">
              {languages.map((language) => (
                <li key={t(language.name, 'en')} className="text-[9.5px] text-[#27272a]">
                  {t(language.name, lang)} — {t(language.level, lang)}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right main column */}
        <div className="col-span-8 flex flex-col gap-3">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#18181b]">
              {L.experience}
            </h2>
            <div className="mt-1 flex flex-col gap-2.5">
              {experience.map((exp) => (
                <div key={exp.company}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[11px] font-semibold text-[#18181b]">
                      {t(exp.role, lang)}
                    </p>
                    <p className="text-[8.5px] text-[#71717a]">
                      {exp.startDate} — {exp.endDate === 'Present' ? L.present : exp.endDate}
                    </p>
                  </div>
                  <p className="text-[9.5px] font-medium text-[#e63926]">{exp.company}</p>
                  <ul className="mt-1 flex flex-col gap-0.5 pl-3">
                    {exp.highlights.map((h) => (
                      <li
                        key={t(h, 'en')}
                        className="list-disc text-[9px] leading-snug text-[#27272a] marker:text-[#a1a1aa]"
                      >
                        {t(h, lang)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#18181b]">
              {L.projects}
            </h2>
            <p className="mt-1 text-[8.5px] font-bold uppercase tracking-wide text-[#2d68ff]">
              {L.devToolsGroup}
            </p>
            <div className="mt-0.5 flex flex-col gap-1">
              {devTools.map((p) => (
                <ProjectRow key={p.title} project={p} lang={lang} />
              ))}
            </div>
            <p className="mt-1.5 text-[8.5px] font-bold uppercase tracking-wide text-[#e63926]">
              {L.clientsGroup}
            </p>
            <div className="mt-0.5 flex flex-col gap-1">
              {clients.map((p) => (
                <ProjectRow key={p.title} project={p} lang={lang} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SkillGroup({
  label,
  items,
  lang,
}: {
  readonly label: string;
  readonly items: typeof skills;
  readonly lang: Lang;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-1.5">
      <p className="text-[8.5px] font-bold uppercase tracking-wide text-[#52525b]">{label}</p>
      <p className="mt-0.5 text-[9px] leading-tight text-[#27272a]">
        {items
          .map((s) => `${s.name} (${t(LEVEL_LABEL[s.level], lang).toLowerCase()})`)
          .join(' · ')}
      </p>
    </div>
  );
}

function ProjectRow({
  project,
  lang,
}: {
  readonly project: (typeof projects)[number];
  readonly lang: Lang;
}) {
  return (
    <div>
      <p className="text-[9.5px] font-semibold text-[#18181b]">
        {project.title}
        <span className="font-normal text-[#71717a]">
          {' — '}
          {project.technologies.slice(0, 4).join(', ')}
        </span>
      </p>
      <p className="text-[8.5px] leading-snug text-[#52525b]">
        {t(project.description, lang)}
      </p>
    </div>
  );
}
