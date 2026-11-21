import { Space_Grotesk, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';

/* ============================================================
   Fonts — Swiss editorial system (Stitch design tokens):
   Space Grotesk (headlines) + Hanken Grotesk (body) + JetBrains Mono
   (metadata/labels/indices). CSS variables are consumed by the
   globals.css @theme block.

   Lives in its own module because the app has two root layouts
   ((en) and (es)): next/font must be called once at module scope and
   reused, never re-instantiated per layout.
   ============================================================ */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['600', '700'],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
  weight: ['400'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const fontVariables = `${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`;
