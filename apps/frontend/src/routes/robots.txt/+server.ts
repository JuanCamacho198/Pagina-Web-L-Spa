import type { RequestHandler } from './$types';
import { BASE_URL } from '$lib/seo';

export const GET: RequestHandler = async () => {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin routes
Disallow: /admin/
Disallow: /staff/
Disallow: /api/

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=86400',
    },
  });
};
