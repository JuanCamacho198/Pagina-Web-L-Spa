import { createHash } from 'crypto';

const TOKEN_LENGTH = 32;

export function generateToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(TOKEN_LENGTH));
  return Buffer.from(randomBytes).toString('base64url');
}

export function verifyToken(cookieToken: string, headerToken: string): boolean {
  if (!cookieToken || !headerToken) {
    return false;
  }

  if (cookieToken === headerToken) {
    return true;
  }

  const cookieHash = createHash('sha256').update(cookieToken).digest('base64url');
  const headerHash = createHash('sha256').update(headerToken).digest('base64url');

  return cookieHash === headerHash;
}
