import { Suspense, type ReactNode } from 'react';
import { connection } from 'next/server';
import { getLang } from '@/lib/cookies';
import {
  personalInfo,
  skills,
  projects,
  experience,
  education,
  integrationConfig,
  testimonials,
} from '@/lib/data';
import type { Lang } from '@/lib/types';

import { HeroSection } from '@/components/journey/hero-section';
import { SkillsSection } from '@/components/journey/skills-section';
import { ExperienceSection } from '@/components/journey/experience-section';
import { ProjectsSection } from '@/components/journey/projects-section';
import { TestimonialsSection } from '@/components/journey/testimonials-section';
import { IntegrationsSection } from '@/components/journey/integrations-section';
import { CertificationsSection } from '@/components/journey/certifications-section';
import { ContactSection } from '@/components/journey/contact-section';
import { EditorialFooter } from '@/components/journey/editorial-footer';
import { AskCamiloWidget } from '@/components/widgets/ask-camilo-widget';
import { Marquee } from '@/components/animations';
import { TECH_ICONS } from '@/components/icons/tech-icons';

/* ============================================================
   TickerStrip — full-bleed editorial marquee between sections.
   Hairline borders top/bottom, slow scroll for readability.
   ============================================================ */
const tickerStack = [
  'React', 'Next.js', 'TypeScript', 'Angular', 'Astro',
  'Lit Element', 'Flutter', 'Tailwind CSS', 'NestJS', 'Node.js',
  'PostgreSQL', 'Go', 'Docker', 'GitHub Actions', 'Vercel',
  'Playwright', 'Vitest', 'MCP', 'OpenAPI',
] as const;

// Pre-resolved per Server Component constraints: Marquee is a Client
// Component, and functions can't cross the RSC boundary — a plain
// object of ReactNode values can, so the icon lookup is built here.
const tickerIcons: Record<string, ReactNode> = Object.fromEntries(
  Object.entries(TECH_ICONS).map(([name, Icon]) => [
    name,
    <Icon key={name} className="h-3.5 w-3.5 shrink-0" />,
  ]),
);

function TickerStrip() {
  return (
    <div className="border-t border-b border-border-hairline bg-canvas-subtle">
      <Marquee
        items={tickerStack}
        speed={20}
        separator=" / "
        className="py-3"
        icons={tickerIcons}
      />
    </div>
  );
}

/* ============================================================
   LangBoundary — defers to request time so getLang() (cookies)
   runs under <Suspense> as required by cacheComponents: true.
   ============================================================ */
async function LangBoundary({
  children,
}: {
  children: (lang: Lang) => React.ReactNode;
}) {
  await connection();
  const lang = await getLang();
  return <>{children(lang)}</>;
}

/* ============================================================
   SectionsFallback — lightweight skeleton while LangBoundary resolves.
   ============================================================ */
function SectionsFallback() {
  return (
    <div
      aria-hidden="true"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center px-6">
        <div className="h-16 md:h-24 w-64 mx-auto bg-[#f4f4f5] animate-pulse mb-4" />
        <div className="h-8 w-48 mx-auto bg-[#f4f4f5] animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Home page — Server Component.
 *
 * Architecture (cacheComponents: true / dynamicIO):
 * - Static shell: EditorialHeader (in layout) + AskCamiloWidget (client).
 * - Dynamic subtree: all sections that need lang cookie resolution are wrapped
 *   in <Suspense> around <LangBoundary>, which calls connection() + getLang()
 *   to opt into request-time rendering.
 *
 * CV access: ContactSection now opens the localized PDF directly in a new tab
 * (no modal, no HTML CV template). PDFs live in /public/cv/.
 */
export default function Home() {
  return (
    <>
      <main>
        <Suspense fallback={<SectionsFallback />}>
          <LangBoundary>
            {(lang) => (
              <>
                <HeroSection data={personalInfo} lang={lang} />
                <SkillsSection skills={skills} lang={lang} />
                <TickerStrip />
                <ExperienceSection experience={experience} lang={lang} />
                <ProjectsSection projects={projects} lang={lang} />
                <TestimonialsSection testimonials={testimonials} lang={lang} />
                <IntegrationsSection config={integrationConfig} />
                <CertificationsSection education={education} lang={lang} />
                <ContactSection data={personalInfo} />
                <EditorialFooter data={personalInfo} lang={lang} />
              </>
            )}
          </LangBoundary>
        </Suspense>
      </main>

      <AskCamiloWidget />
    </>
  );
}
