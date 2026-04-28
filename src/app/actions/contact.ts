'use server';

import { z } from 'zod';
import { env, assertServerEnv } from '@/lib/env';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(200),
  title: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(10, 'Message too short').max(2000),
  website: z.string().max(0).optional(), // honeypot
});

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; error: string; fieldErrors?: Record<string, string[]> };

export async function sendContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot rejection — silent success to fool bots
  if (formData.get('website')) return { status: 'success' };

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    title: formData.get('title'),
    message: formData.get('message'),
    website: formData.get('website'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Please check the form fields',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    assertServerEnv();
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://camilohenriquez.com',
      },
      body: JSON.stringify({
        service_id: env.EMAILJS_SERVICE_ID,
        template_id: env.EMAILJS_TEMPLATE_ID,
        user_id: env.EMAILJS_PUBLIC_KEY,
        template_params: {
          name: parsed.data.name,
          email: parsed.data.email,
          title: parsed.data.title,
          message: parsed.data.message,
          time: new Date().toISOString(),
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[contact] EmailJS non-2xx:', res.status, text);
      return { status: 'error', error: 'Could not send message. Please try again.' };
    }

    return { status: 'success' };
  } catch (e) {
    console.error('[contact] sendContact failed:', e);
    return { status: 'error', error: 'Network error. Please try again or email directly.' };
  }
}
