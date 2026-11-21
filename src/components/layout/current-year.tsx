'use client';

/* ============================================================
   CurrentYear — the copyright year as a client leaf.

   `new Date()` cannot run while a Server Component is prerendered
   (cacheComponents: true), which is exactly what happens on the
   static `/es` document. Rendering the year from a client component
   keeps both documents statically prerenderable.
   ============================================================ */
export function CurrentYear() {
  return <>{new Date().getFullYear()}</>;
}
