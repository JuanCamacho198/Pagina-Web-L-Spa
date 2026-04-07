import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
      [key: string]: unknown;
    };
    session?: {
      id: string;
      expiresAt: Date;
      [key: string]: unknown;
    };
  }
}