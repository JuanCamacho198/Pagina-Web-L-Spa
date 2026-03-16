import { MiddlewareHandler } from 'hono';

export interface CSPConfig {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  fontSrc?: string[];
  connectSrc?: string[];
  frameAncestors?: string[];
  baseUri?: string[];
  formAction?: string[];
}

export interface HSTSConfig {
  maxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
}

export interface SecurityHeadersConfig {
  csp?: CSPConfig | boolean;
  hsts?: HSTSConfig | boolean;
  xFrameOptions?: 'DENY' | 'SAMEORIGIN';
  xContentTypeOptions?: 'nosniff';
  referrerPolicy?: string;
  permissionsPolicy?: Record<string, string[]>;
}

function buildCSP(csp: CSPConfig | undefined, nonce: string): string {
  if (!csp) {
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

  const directives: string[] = [];

  if (csp.defaultSrc) {
    directives.push(`default-src ${csp.defaultSrc.join(' ')}`);
  } else {
    directives.push("default-src 'self'");
  }

  if (csp.scriptSrc) {
    const nonceSrc = csp.scriptSrc.includes("'nonce-"+nonce+"'") 
      ? csp.scriptSrc 
      : [...csp.scriptSrc, `'nonce-${nonce}'`];
    directives.push(`script-src ${nonceSrc.join(' ')}`);
  } else {
    directives.push(`script-src 'self' 'nonce-${nonce}'`);
  }

  if (csp.styleSrc) {
    directives.push(`style-src ${csp.styleSrc.join(' ')}`);
  } else {
    directives.push("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com");
  }

  if (csp.imgSrc) {
    directives.push(`img-src ${csp.imgSrc.join(' ')}`);
  } else {
    directives.push("img-src 'self' data: https:");
  }

  if (csp.fontSrc) {
    directives.push(`font-src ${csp.fontSrc.join(' ')}`);
  } else {
    directives.push("font-src 'self' https://fonts.gstatic.com");
  }

  if (csp.connectSrc) {
    directives.push(`connect-src ${csp.connectSrc.join(' ')}`);
  } else {
    directives.push("connect-src 'self'");
  }

  if (csp.frameAncestors) {
    directives.push(`frame-ancestors ${csp.frameAncestors.join(' ')}`);
  } else {
    directives.push("frame-ancestors 'none'");
  }

  if (csp.baseUri) {
    directives.push(`base-uri ${csp.baseUri.join(' ')}`);
  } else {
    directives.push("base-uri 'self'");
  }

  if (csp.formAction) {
    directives.push(`form-action ${csp.formAction.join(' ')}`);
  } else {
    directives.push("form-action 'self'");
  }

  return directives.join('; ');
}

function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Buffer.from(bytes).toString('base64url');
}

export const securityHeaders = (config?: SecurityHeadersConfig): MiddlewareHandler => {
  return async (c, next) => {
    const nonce = generateNonce();
    c.set('cspNonce', nonce);

    if (config?.csp !== false) {
      const cspValue = config?.csp === true 
        ? buildCSP(undefined, nonce)
        : buildCSP(config?.csp as CSPConfig, nonce);
      c.res.headers.set('Content-Security-Policy', cspValue);
    }

    if (config?.hsts !== false) {
      const hstsConfig = config?.hsts === true 
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : config?.hsts as HSTSConfig | undefined;
      
      if (hstsConfig) {
        let hstsValue = `max-age=${hstsConfig.maxAge}`;
        if (hstsConfig.includeSubDomains) {
          hstsValue += '; includeSubDomains';
        }
        if (hstsConfig.preload) {
          hstsValue += '; preload';
        }
        c.res.headers.set('Strict-Transport-Security', hstsValue);
      } else {
        c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      }
    }

    if (config?.xFrameOptions) {
      c.res.headers.set('X-Frame-Options', config.xFrameOptions);
    } else {
      c.res.headers.set('X-Frame-Options', 'DENY');
    }

    if (config?.xContentTypeOptions) {
      c.res.headers.set('X-Content-Type-Options', config.xContentTypeOptions);
    } else {
      c.res.headers.set('X-Content-Type-Options', 'nosniff');
    }

    if (config?.referrerPolicy) {
      c.res.headers.set('Referrer-Policy', config.referrerPolicy);
    } else {
      c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    if (config?.permissionsPolicy) {
      const perms = Object.entries(config.permissionsPolicy)
        .map(([feature, allowlist]) => {
          const permsList = allowlist.length > 0 ? allowlist.join(', ') : '()';
          return `${feature}=${permsList}`;
        })
        .join(', ');
      c.res.headers.set('Permissions-Policy', perms);
    } else {
      c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    }

    c.res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

    await next();
  };
};

export function getCSPNonce(c: { get: (key: string) => unknown }): string {
  return c.get('cspNonce') as string;
}
