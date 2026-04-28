export const env = {
  EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID ?? '',
  EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID ?? '',
  EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY ?? '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://camilohenriquez.com',
  NEXT_PUBLIC_ASK_CAMILO_WEBHOOK: process.env.NEXT_PUBLIC_ASK_CAMILO_WEBHOOK ?? '',
} as const;

export function assertServerEnv(): void {
  const missing = (
    ['EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID', 'EMAILJS_PUBLIC_KEY'] as const
  ).filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required server env vars: ${missing.join(', ')}`);
  }
}
