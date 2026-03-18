import type { Handle } from '@sveltejs/kit';
import { locale, waitLocale } from 'svelte-i18n';
import '$lib/i18n'; // Ensure i18n is initialized
import { Sentry } from './lib/sentry';

const CSP_REPORT_ONLY = true;

function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Buffer.from(bytes).toString('base64url');
}

function buildCSP(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

export const handle: Handle = async ({ event, resolve }) => {
  const { url, request, cookies } = event;
  
  // Detect language from cookie, or default to 'es'
  let lang = cookies.get('lang');
  if (!lang) {
    const acceptLanguage = request.headers.get('accept-language');
    lang = acceptLanguage && acceptLanguage.includes('en') ? 'en' : 'es';
  }
  
  // Set locale in Locals
  event.locals.lang = lang as 'es' | 'en';
  
  // Redirect root to /[lang]
  if (url.pathname === '/') {
    return new Response(null, {
      status: 302,
      headers: { location: `/${lang}` }
    });
  }

  // Set the locale for svelte-i18n on the server
  // Determine if URL has a lang parameter (e.g., /en/about)
  const pathLang = url.pathname.split('/')[1];
  if (pathLang === 'en' || pathLang === 'es') {
    locale.set(pathLang);
    event.locals.lang = pathLang;
  } else {
    locale.set(lang);
  }

  await waitLocale();

  const nonce = generateNonce();
  
  const cspPolicy = buildCSP(nonce);
  const hstsValue = 'max-age=31536000; includeSubDomains; preload';
  const xFrameOptionsValue = 'DENY';
  const xContentTypeOptionsValue = 'nosniff';
  const referrerPolicyValue = 'strict-origin-when-cross-origin';
  const permissionsPolicyValue = 'camera=(), microphone=(), geolocation=()';
  const permittedCrossDomainPoliciesValue = 'none';

  const response = await resolve(event);

  const cspHeaderName = CSP_REPORT_ONLY 
    ? 'Content-Security-Policy-Report-Only' 
    : 'Content-Security-Policy';
  response.headers.set(cspHeaderName, cspPolicy);
  response.headers.set('Strict-Transport-Security', hstsValue);
  response.headers.set('X-Frame-Options', xFrameOptionsValue);
  response.headers.set('X-Content-Type-Options', xContentTypeOptionsValue);
  response.headers.set('Referrer-Policy', referrerPolicyValue);
  response.headers.set('Permissions-Policy', permissionsPolicyValue);
  response.headers.set('X-Permitted-Cross-Domain-Policies', permittedCrossDomainPoliciesValue);

  return response;
};
