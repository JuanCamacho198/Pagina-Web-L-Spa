const DEFAULT_FRONTEND_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://l-spa-frontend.vercel.app',
  'https://l-spa.vercel.app',
  'https://l-spa-git-*.vercel.app',
] as const;

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '');
}

function wildcardToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

function parseOrigins(origins?: string): string[] {
  if (!origins) return [];

  return origins
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
}

export function getTrustedOrigins(origins?: string): string[] {
  const configuredOrigins = parseOrigins(origins);

  if (configuredOrigins.length > 0) {
    return configuredOrigins;
  }

  return [...DEFAULT_FRONTEND_ORIGINS];
}

export function buildCorsOriginValidator(origins?: string) {
  const configuredOrigins = getTrustedOrigins(origins);

  const exactOrigins = new Set<string>();
  const wildcardOrigins: RegExp[] = [];

  for (const origin of configuredOrigins) {
    if (origin.includes('*')) {
      wildcardOrigins.push(wildcardToRegex(origin));
      continue;
    }

    exactOrigins.add(origin);
  }

  return (requestOrigin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!requestOrigin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(requestOrigin);
    const wildcardMatch = wildcardOrigins.some((pattern) => pattern.test(normalizedOrigin));

    if (exactOrigins.has(normalizedOrigin) || wildcardMatch) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  };
}
