import type { Lang } from '@/lib/types';
import { buildJsonLd } from '@/lib/structured-data';

/**
 * Renders the JSON-LD block for one crawlable document.
 * The payload is a few KB of static text — no client JS involved.
 */
export function StructuredData({ lang }: { readonly lang: Lang }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(lang)) }}
    />
  );
}
