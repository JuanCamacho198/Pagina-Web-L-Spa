import type { RequestHandler } from './$types';
import { BASE_URL, SITE_NAME, SITE_DESCRIPTION } from '$lib/seo';

const PUBLIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/servicios', priority: '0.9', changefreq: 'weekly' },
  { path: '/sobre-nosotros', priority: '0.7', changefreq: 'monthly' },
  { path: '/contacto', priority: '0.7', changefreq: 'monthly' },
  { path: '/informacion-importante', priority: '0.6', changefreq: 'monthly' },
  { path: '/preguntas-frecuentes', priority: '0.6', changefreq: 'monthly' },
  { path: '/politicas/privacidad', priority: '0.5', changefreq: 'yearly' },
  { path: '/politicas/cookies', priority: '0.5', changefreq: 'yearly' },
  { path: '/politicas/cancelacion', priority: '0.5', changefreq: 'yearly' },
  { path: '/politicas/datos', priority: '0.5', changefreq: 'yearly' },
];

export const GET: RequestHandler = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  let serviceSlugs: string[] = [];
  try {
    const response = await fetch(`${BASE_URL}/api/services`);
    if (response.ok) {
      const services = await response.json();
      serviceSlugs = (services as Array<{ slug?: string }>)
        .filter((s) => s.slug)
        .map((s) => s.slug as string);
    }
  } catch {
    // fallback to empty array if API unavailable
  }
  
  const urls = [
    ...PUBLIC_ROUTES.map((route) => `
    <url>
      <loc>${BASE_URL}${route.path}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${route.changefreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>`),
    ...serviceSlugs.map((slug) => `
    <url>
      <loc>${BASE_URL}/servicios/${slug}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`),
  ].join('');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600',
    },
  });
};
