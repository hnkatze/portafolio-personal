import { Suspense } from 'react';
import { connection } from 'next/server';
import { getLang } from '@/lib/cookies';
import {
  personalInfo,
  skills,
  projects,
  experience,
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
import { ContactSection } from '@/components/journey/contact-section';
import { AskCamiloWidget } from '@/components/widgets/ask-camilo-widget';
import { Marquee } from '@/components/animations';

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

function TickerStrip() {
  return (
    <div className="border-t border-b border-[#e4e4e7] bg-white">
      <Marquee items={tickerStack} speed={50} separator=" / " className="py-3" />
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
                <SkillsSection skills={skills} />
                <TickerStrip />
                <ExperienceSection experience={experience} lang={lang} />
                <ProjectsSection projects={projects} lang={lang} />
                <TestimonialsSection testimonials={testimonials} lang={lang} />
                <IntegrationsSection config={integrationConfig} />
                <ContactSection data={personalInfo} />
              </>
            )}
          </LangBoundary>
        </Suspense>
      </main>

      <AskCamiloWidget />
    </>
  );
}
