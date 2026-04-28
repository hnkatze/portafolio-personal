import { Suspense } from 'react';
import { connection } from 'next/server';
import { getLang } from '@/lib/cookies';
import {
  personalInfo,
  skills,
  projects,
  experience,
  education,
  certifications,
  languages,
  integrationConfig,
  testimonials,
} from '@/lib/data';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

import { JourneyNav } from '@/components/journey/journey-nav';
import { HeroSection } from '@/components/journey/hero-section';
import { SkillsSection } from '@/components/journey/skills-section';
import { ExperienceSection } from '@/components/journey/experience-section';
import { ProjectsSection } from '@/components/journey/projects-section';
import { TestimonialsSection } from '@/components/journey/testimonials-section';
import { IntegrationsSection } from '@/components/journey/integrations-section';
import { ContactSection } from '@/components/journey/contact-section';
import { CvModal } from '@/components/cv/cv-modal';
import { CvTemplate } from '@/components/cv/cv-template';
import { AskCamiloWidget } from '@/components/widgets/ask-camilo-widget';

/* ============================================================
   LangBoundary — defers to request time so getLang() (cookies)
   runs under <Suspense> as required by cacheComponents: true.

   The children render-prop gets the resolved lang and renders
   all sections that need server-side lang resolution.
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
   SectionsFallback — lightweight skeleton while LangBoundary
   resolves. Uses shimmer blocks with min-h-screen so the
   scroll-spy targets are stable during hydration.
   ============================================================ */
function SectionsFallback() {
  return (
    <div
      aria-hidden="true"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center px-6">
        <div className="h-16 md:h-24 w-64 mx-auto rounded-lg bg-white/5 animate-pulse mb-4" />
        <div className="h-8 w-48 mx-auto rounded-lg bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Home page — Server Component.
 *
 * Architecture (cacheComponents: true / dynamicIO):
 * - Static shell: JourneyNav (client) + CvModal shell + AskCamiloWidget (client).
 * - Dynamic subtree: all sections that need lang cookie resolution are wrapped
 *   in <Suspense> around <LangBoundary>, which calls connection() + getLang()
 *   to opt into request-time rendering.
 * - CvTemplate is rendered as RSC with initialLang="en" passed to CvModal — the
 *   modal swaps DOM text client-side via data-i18n-en/es when user toggles.
 */
export default function Home() {
  return (
    <>
      <JourneyNav />

      <main>
        <Suspense fallback={<SectionsFallback />}>
          <LangBoundary>
            {(lang) => (
              <>
                <HeroSection data={personalInfo} lang={lang} />
                <SkillsSection skills={skills} />
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

      {/* Global CV modal — opened by any component dispatching 'open-cv-modal' */}
      <CvModal
        initialLang="en"
        ownerName={personalInfo.name}
        ownerTitle={t(personalInfo.title, 'en')}
      >
        <CvTemplate
          personalInfo={personalInfo}
          skills={skills}
          experience={experience}
          education={education}
          certifications={certifications}
          languages={languages}
          initialLang="en"
        />
      </CvModal>

      {/* Floating Ask-Camilo chat widget */}
      <AskCamiloWidget />
    </>
  );
}
